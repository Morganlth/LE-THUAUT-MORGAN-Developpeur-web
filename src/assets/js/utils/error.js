// #ERROR CLASS

export default class AppError extends Error
{
    constructor(type, msg)
    {
        super(msg)

        this.name = type
    }
}