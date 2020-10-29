import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import { response } from 'express';
import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) throw new Error('Only authenticated users can change avatar.');

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.diretory, user.avatar);
      const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExist) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}
