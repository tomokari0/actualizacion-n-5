import { NextRequest, NextResponse } from 'next/server';
import { LikeService } from '@/lib/services/likeService';
import { CreateLikeData } from '@/lib/models/Like';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, targetId, targetType } = body;

    if (!userId || !targetId || !targetType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['movie', 'comment'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid target type' },
        { status: 400 }
      );
    }

    const likeData: CreateLikeData = {
      userId,
      targetId,
      targetType
    };

    const result = await LikeService.toggleLike(likeData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');
    const targetType = searchParams.get('targetType') as 'movie' | 'comment';
    const userId = searchParams.get('userId');

    if (!targetId || !targetType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const likeCount = await LikeService.getLikeCount(targetId, targetType);
    let isLiked = false;

    if (userId) {
      isLiked = await LikeService.isLikedByUser(userId, targetId, targetType);
    }

    return NextResponse.json({
      likes: likeCount,
      isLiked
    });
  } catch (error) {
    console.error('Error fetching like data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like data' },
      { status: 500 }
    );
  }
}