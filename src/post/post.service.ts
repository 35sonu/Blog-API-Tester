import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOne({ where: { id } });
  }

  create(post: Partial<Post>): Promise<Post> {
    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }

  async update(id: number, post: Partial<Post>): Promise<Post> {
    await this.postRepository.update(id, post);
    return this.postRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
