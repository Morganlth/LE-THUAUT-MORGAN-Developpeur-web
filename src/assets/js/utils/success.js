// #SUCCESS CLASS

export default class AppSuccess extends Error
{
    constructor(msg)
    {
        super(msg)

        this.name = 'Success'
    }
}