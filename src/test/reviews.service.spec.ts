import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsRepository } from '../repositories/reviews.repository';
import { ReviewsService } from '../services/reviews.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let repository: ReviewsRepository;

  beforeEach(async () => {
    const mockReviewsRepository: Partial<ReviewsRepository> = {
      findByUserAndMovie: jest.fn(),
      create: jest.fn(),
      findByMovieId: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: ReviewsRepository,
          useValue: mockReviewsRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    repository = module.get<ReviewsRepository>(ReviewsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendReview', () => {
    it('should throw error if rating is missing', async () => {
      await expect(
        service.sendReview('user1', 'movie1', 'Great movie!', null),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if review already exists', async () => {
      (repository.findByUserAndMovie as jest.Mock).mockResolvedValue({});

      await expect(
        service.sendReview('user1', 'movie1', 'Great movie!', 5),
      ).rejects.toThrow(BadRequestException);

      expect(repository.findByUserAndMovie).toHaveBeenCalledWith(
        'user1',
        'movie1',
      );
    });

    it('should create and return a new review', async () => {
      (repository.findByUserAndMovie as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockResolvedValue({
        userId: 'user1',
        movieId: 'movie1',
        comment: 'Great movie!',
        rating: 5,
      });

      const result = await service.sendReview(
        'user1',
        'movie1',
        'Great movie!',
        5,
      );

      expect(repository.create).toHaveBeenCalledWith({
        userId: 'user1',
        movieId: 'movie1',
        comment: 'Great movie!',
        rating: 5,
      });
      expect(result).toEqual({
        message: 'Review submitted successfully',
        review: {
          userId: 'user1',
          movieId: 'movie1',
          comment: 'Great movie!',
          rating: 5,
        },
      });
    });
  });

  describe('getReviewsByMovieId', () => {
    it('should return reviews and calculate the average rating', async () => {
      const reviews = [{ rating: 4 }, { rating: 5 }];
      (repository.findByMovieId as jest.Mock).mockResolvedValue(reviews);

      const result = await service.getReviewsByMovieId('movie1');

      expect(repository.findByMovieId).toHaveBeenCalledWith('movie1');
      expect(result).toEqual({
        movieId: 'movie1',
        averageRating: 4.5,
        reviews,
      });
    });

    it('should return an average rating of 0 if there are no reviews', async () => {
      (repository.findByMovieId as jest.Mock).mockResolvedValue([]);

      const result = await service.getReviewsByMovieId('movie1');

      expect(repository.findByMovieId).toHaveBeenCalledWith('movie1');
      expect(result).toEqual({
        movieId: 'movie1',
        averageRating: 0,
        reviews: [],
      });
    });
  });

  describe('addLikeReview', () => {
    it('should throw error if review not found', async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.addLikeReview('review1')).rejects.toThrow(
        BadRequestException,
      );

      expect(repository.findById).toHaveBeenCalledWith('review1');
    });
  });
});
