import { CookieOptions } from "express"


const generateCookieOptions = (): CookieOptions => {
    return ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use true if HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        partitioned: process.env.NODE_ENV === 'production',
    })
}

export default generateCookieOptions