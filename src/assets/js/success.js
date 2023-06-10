/* #SUCCESS */

/* #EXPORT */

export default class Success extends Error
{
    constructor(msg)
    {
        super(msg)

        this.name = 'Success'
    }
}