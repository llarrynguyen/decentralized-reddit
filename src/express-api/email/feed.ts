import { resolveSubsocialApi } from '../../connections/subsocial';
import { PostId } from '@subsocial/types/substrate/interfaces';
import { createHrefForPost, getAccountContent, getFormatDate, resolveIpfsUrl, toShortAddress } from './utils';
import { FeedTemplateProp } from './types';
import { summarizeMd } from '@subsocial/utils/summarize'
import { Activity } from '@subsocial/types';
import { PostWithAllDetails } from '@subsocial/types/dto/sub';

const createPostData = async ({ post, space }: PostWithAllDetails) => {
  const { id, owner, spaceId, created: { time } } = post.struct

  const { title: postTitle, body, image } = post.content

  const { summary: postSummary } = summarizeMd(body)

  const { name: spaceName } = space.content

  const ownerAddress = owner.toString()

  const { name: ownerName = toShortAddress(ownerAddress), avatar } = await getAccountContent(ownerAddress)

  const postLink = createHrefForPost(spaceId.toString(), id.toString())

  return {
    ownerName,
    avatar,
    spaceName,
    postTitle,
    postLink,
    postSummary,
    date: getFormatDate(time.toString()),
    image: resolveIpfsUrl(image)
  }
}

export const createFeedEmailMessage = async (activity: Activity): Promise<FeedTemplateProp> => {
  const { post_id } = activity
  const subsocial = await resolveSubsocialApi()
  const post = await subsocial.findPostWithAllDetails(post_id as unknown as PostId)

  const { extension } = post.post.struct

  const postData = await createPostData(post)
  if (extension.isSharedPost) {
    const extPost = await subsocial.findPostWithAllDetails(extension.asSharedPost)

    const ext = await createPostData(extPost)

    return { ...postData, ext }
  }

  return postData
}