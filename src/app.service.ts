import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Server ShopCo is running on PORT ${process.env.PORT || 3000}`;
  }
}
