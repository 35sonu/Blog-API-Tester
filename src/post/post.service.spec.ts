import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';

describe('PostService', () => {
  let service: PostService;
  let repository: jest.Mocked<Repository<Post>>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post content',
    authorId: 1,
    author: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all posts with authors', async () => {
      const posts = [mockPost, { ...mockPost, id: 2, title: 'Another Post' }];
      repository.find.mockResolvedValue(posts as Post[]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['author'],
        order: { createdAt: 'DESC' }
      });
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should find a post by id', async () => {
      repository.findOne.mockResolvedValue(mockPost as Post);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author']
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException when post is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['author']
      });
    });
  });

  describe('findByAuthor', () => {
    it('should find posts by author id', async () => {
      const authorPosts = [mockPost];
      repository.find.mockResolvedValue(authorPosts as Post[]);

      const result = await service.findByAuthor(1);

      expect(repository.find).toHaveBeenCalledWith({
        where: { authorId: 1 },
        relations: ['author'],
        order: { createdAt: 'DESC' }
      });
      expect(result).toEqual(authorPosts);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        content: 'New post content'
      };
      const authorId = 1;
      const newPost = { ...mockPost, ...createPostDto };

      repository.create.mockReturnValue(newPost as Post);
      repository.save.mockResolvedValue(newPost as Post);

      const result = await service.create(createPostDto, authorId);

      expect(repository.create).toHaveBeenCalledWith({
        ...createPostDto,
        authorId
      });
      expect(repository.save).toHaveBeenCalledWith(newPost);
      expect(result).toEqual(newPost);
    });
  });

  describe('update', () => {
    it('should update a post when user is the author', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'Updated content'
      };
      const updatedPost = { ...mockPost, ...updatePostDto };

      // Mock findOne for initial check and for returning updated post
      repository.findOne
        .mockResolvedValueOnce(mockPost as Post) // For findOne in update method
        .mockResolvedValueOnce(updatedPost as Post); // For findOne after update
      repository.update.mockResolvedValue(undefined as any);

      const result = await service.update(1, updatePostDto, 1);

      expect(repository.update).toHaveBeenCalledWith(1, updatePostDto);
      expect(result).toEqual(updatedPost);
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post'
      };
      const otherUserId = 2;

      repository.findOne.mockResolvedValue(mockPost as Post);

      await expect(
        service.update(1, updatePostDto, otherUserId)
      ).rejects.toThrow(ForbiddenException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when post does not exist', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post'
      };

      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, updatePostDto, 1)
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a post when user is the author', async () => {
      repository.findOne.mockResolvedValue(mockPost as Post);
      repository.delete.mockResolvedValue(undefined as any);

      await service.remove(1, 1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException when user is not the author', async () => {
      const otherUserId = 2;

      repository.findOne.mockResolvedValue(mockPost as Post);

      await expect(
        service.remove(1, otherUserId)
      ).rejects.toThrow(ForbiddenException);

      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when post does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.remove(999, 1)
      ).rejects.toThrow(NotFoundException);

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
