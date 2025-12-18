import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!data) {
      return user;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user?.[data as keyof User];
  },
);
