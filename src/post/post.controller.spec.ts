import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('PostController', () => {
  let controller: PostController;
  let postService: jest.Mocked<PostService>;

  const mockUser = {
    userId: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockRequest = {
    user: mockUser,
  };

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    authorId: 1,
    author: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPostService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByAuthor: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PostController>(PostController);
    postService = module.get(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        content: 'New content',
      };

      postService.create.mockResolvedValue(mockPost as any);

      const result = await controller.create(createPostDto, mockRequest as any);

      expect(postService.create).toHaveBeenCalledWith(createPostDto, mockUser.userId);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const posts = [mockPost];
      postService.findAll.mockResolvedValue(posts as any);

      const result = await controller.findAll();

      expect(postService.findAll).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe('findMyPosts', () => {
    it('should return current user posts', async () => {
      const posts = [mockPost];
      postService.findByAuthor.mockResolvedValue(posts as any);

      const result = await controller.findMyPosts(mockRequest as any);

      expect(postService.findByAuthor).toHaveBeenCalledWith(mockUser.userId);
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      postService.findOne.mockResolvedValue(mockPost as any);

      const result = await controller.findOne('1');

      expect(postService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
      };
      const updatedPost = { ...mockPost, ...updatePostDto };

      postService.update.mockResolvedValue(updatedPost as any);

      const result = await controller.update('1', updatePostDto, mockRequest as any);

      expect(postService.update).toHaveBeenCalledWith(1, updatePostDto, mockUser.userId);
      expect(result).toEqual(updatedPost);
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      postService.remove.mockResolvedValue(undefined);

      await controller.remove('1', mockRequest as any);

      expect(postService.remove).toHaveBeenCalledWith(1, mockUser.userId);
    });
  });
});
