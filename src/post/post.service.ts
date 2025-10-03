import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ 
      where: { id },
      relations: ['author']
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    return post;
  }

  async findByAuthor(authorId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
  }

  create(createPostDto: CreatePostDto, authorId: number): Promise<Post> {
    const newPost = this.postRepository.create({
      ...createPostDto,
      authorId
    });
    return this.postRepository.save(newPost);
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.findOne(id);
    
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }
    
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOne(id);
    
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    
    await this.postRepository.delete(id);
  }
}
