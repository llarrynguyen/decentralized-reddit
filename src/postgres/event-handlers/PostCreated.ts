import { EventHandlerFn } from '../../substrate/types';
import { onCommentCreated } from './CommentCreated';
import { onRootCreated } from './RootPostCreated';
import { findPostAndProccess } from './utils';

export const onPostCreated: EventHandlerFn = async (eventAction) => {
  await findPostAndProccess({
    onRootPost: onRootCreated,
    onComment: onCommentCreated,
    eventAction
  })
}
