import { getCurrentUser } from "@/lib/appwrite"
import { User } from "@/lib/model"
import { createContext, useContext, useEffect, useState } from "react"

type GlobalContextType = {
    user: User
    setUser: (user:User) => void
    refreshUser: () => void // 重新获取用户信息
    refreshPosts: () => void,  // 重新获取帖子列表
    freshPostCnt: number
}

const GlobalContext = createContext<GlobalContextType>({
    user: {
        userId: '',
        username: "",
        email: "",
        avatarUrl: ""
    },
    setUser: () => {},
    refreshUser: () => {},
    refreshPosts: () => {},
    freshPostCnt: 0
})

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}

export const GlobalContextProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User>({
        userId: '',
        username: "",
        email: "",
        avatarUrl: ""
    })

    const [refreshCnt, setRefreshUserCnt] = useState(0)
    const [refreshPostsCnt, setRefreshPostsCnt] = useState(0)

    const getUserInfo = async () => {
        try {
            const user = await getCurrentUser()
            if (user) {
                setUser(user)
            }
        } catch (error) {
            console.log(error)
            setUser({
                userId: '',
                username: "",
                email: "",
                avatarUrl: ""
            })
        }
    }

    useEffect(() => {
        getUserInfo()
    }, [refreshCnt])

    return (
        <GlobalContext.Provider
            value={
                {
                    user, 
                    setUser,
                    refreshUser: () => {
                        setRefreshUserCnt(prev => prev + 1)
                    },
                    refreshPosts: () => {
                        setRefreshPostsCnt(prev => prev + 1)
                    },
                    freshPostCnt: refreshPostsCnt
                }
            }   
        >
            {children}
        </GlobalContext.Provider>
    )
}