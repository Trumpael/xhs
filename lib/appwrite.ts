import { ImageResult } from 'expo-image-manipulator'
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite'
import { User } from './model'
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6867c946002099cf8dd1')

// const projectId = '6867c946002099cf8dd1'
const databaseId = '6867e7920022293fac2b'
const collectionIdUser = '6867e84b0039d29e982e'
const collectionIdPost = '6873b04a0011ac34aa84'
const collectionIdComment = '6873b07c000a3f8d0831'
const collectionIdFollow = '6873b09500161645a00d'
const bucketId = '68767ca7001e7e15b814'

const account = new Account(client)
const database = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)

export const uploadFile = async (image_key: string, file: ImageResult) => {
    try {
        const res = await storage.createFile(bucketId, image_key, {
            name: image_key,
            type: 'image/jpeg',
            size: file.height * file.width,
            uri: file.uri
        })
        // console.log('uploadFile res', res);
        

        const fileId = res.$id
        console.log('fileId', fileId);
        
        // const fileUrl = await storage.getFileDownload(bucketId, fileId)
        // 手动拼接下载链接，保证一定可用
        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/download?project=6867c946002099cf8dd1`;
        console.log('fileUrl', fileUrl);

        return {
            fileId,
            fileUrl
        }
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

// 登录部分API
const createUser = async (email: string, username: string, user_id: string, avatar_url: string) => {
    try {
        const user = await database.createDocument(databaseId, collectionIdUser, ID.unique(), {
            email,
            username,
            user_id,
            avatar_url
        })
        return user.$id
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getUserByUserId = async (user_id: string) => {
    try {
        const user = await database.listDocuments(databaseId, collectionIdUser, [Query.equal('user_id', user_id)])
        return user.documents[0]
    } catch (error) {
        console.log('getUserByUserId error', error)
        throw error
    }
}

export const login = async (email: string, password: string) => {
    try {
        const res = await account.createEmailPasswordSession(email, password)
        // 得到session
        return res
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const logout = async () => {
    try {
        await account.deleteSession('current')
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const register = async (email: string, password: string, username: string) => {
    try {
        // 1. 注册
        const user = await account.create(ID.unique(), email, password, username)
        const avatarUrl = avatars.getInitials(username)
        const res = await createUser(email, username, user.$id, avatarUrl.toString())
        // 2. 登录
        await login(email, password)
        return user.$id
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getCurrentUser = async () => {
    const res = await account.get()
    if (res.$id) {
        const user = await getUserByUserId(res.$id)
        return {
            userId: res.$id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatar_url
        } as User
    }

    return null
}

// 1. post
export const createPost = async (title: string, content: string, image_url: string, creator_id: string, creator_name: string, creator_avatar_url: string) => {
    try {
        const post = await database.createDocument(databaseId, collectionIdPost, ID.unique(), {
            title,
            content,
            image_url,
            creator_id,
            creator_name,
            creator_avatar_url
        })
        return post.$id
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getPostById = async (post_id: string) => {
    try {
        const res = await database.getDocument(databaseId, collectionIdPost, post_id)
        return res
    } catch (error) {
        console.log(error)
        throw error
    }
}

// 获取帖子列表
export const getPosts = async (pageNumber: number, pageSize: number, userIds?: string[]) => {
    try {
        let queries = [Query.limit(pageSize), Query.offset(pageNumber * pageSize), Query.orderDesc('$createdAt')]
        if (userIds) {
            queries.push(Query.equal('creator_id', userIds))
        }
        const posts = await database.listDocuments(databaseId, collectionIdPost, queries)
        return posts.documents
    } catch (error) {
        console.log(error)
        return []
    }
}

// 2. comment
export const createComment = async (post_id: string, from_user_id: string, content: string, from_user_name: string, from_user_avatar_url: string) => {
    try {
        const res = await database.createDocument(databaseId, collectionIdComment, ID.unique(), {
            post_id,
            from_user_id,
            from_user_name,
            from_user_avatar_url,
            content
        })

        return res
    } catch (error) {
        console.log('createComment error', error)
        throw error
    }
}

export const getCommentsByPostId = async (post_id: string) => {
    try {
        const res = await database.listDocuments(databaseId, collectionIdComment, [Query.equal('post_id', post_id)])
        return res.documents
    } catch (error) {
        console.log('getCommentsByPostId', error)
        throw error
    }
}

// 3. follow
export const followUser = async (from_user_id: string, to_user_id: string) => {
    try {
        const res = await database.createDocument(databaseId, collectionIdFollow, ID.unique(), {
            from_user_id,
            to_user_id
        })
        return res
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const unFollowUser = async (from_user_id: string, to_user_id: string) => {
    try {
        const res = await database.listDocuments(databaseId, collectionIdFollow,
            [Query.equal('from_user_id', from_user_id), Query.equal('to_user_id', to_user_id)])
        if (res && res.documents) {
            const deleteRes = await database.deleteDocument(databaseId, collectionIdFollow, res.documents[0].$id)
            return deleteRes
        }
        return null

    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getFollowingUsers = async (user_id: string) => {
    try {
        const res = await database.listDocuments(databaseId, collectionIdFollow,
            [Query.equal('from_user_id', user_id)]
        )
        return res.documents.map((item) => item.to_user_id)
    } catch (error) {
        console.log(error)
        throw error
    }
}