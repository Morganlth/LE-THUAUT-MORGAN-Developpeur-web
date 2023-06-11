// #APP CLASS

export default class App
{
    keyWords = ['log', 'clear', 'success', 'effect']

    constructor(cmd) { this.cmd = cmd }

    add(name, command)
    {
        if (this.keyWords.includes(name)) return

        this.keyWords.push(name)

        this[name] = command
    }

    testRange(n, min, max)
    {
        return isNaN(parseInt(n, 10)) ? [false, new TypeError('la valeur doit être un nombre')] :
        n < min || n > max ? [false, new RangeError(`la valeur doit être comprise entre [${min} et ${max}]`)] :
        [true]
    }

    log(msg)
    {
        const type = msg instanceof Error ? msg instanceof Success ? 'success' : 'error' : null

        this.cmd.lastChild.insertAdjacentHTML('beforebegin', `
            <div class="line">
                <div class="line-indicator"></div>
                <div class="line-content">
                    ${type ? `
                    <span class="console-${type}">${msg.name}:</span>
                    <span class="console-result">${msg.message}</span>` : `
                    <span class="console-result">${msg}</span>`}
                </div>
            </div>
        `)
    }

    clear()
    {
        const children = [...this.cmd.children]

        for (let i = children.length - 2; i >= 0; i--) this.cmd.removeChild(children[i])
    }

    success(msg) { this.log(new Success(msg)) }

    effect(o)
    {
        const [r, err] = this.testRange(o, 0, 1)

        if (!r) this.log(err)
        else
        {
            document.querySelector(':root').style.setProperty('--effect-opacity', o)
            this.success('effet = ' + o)
        }
    }
}

// #SUCCESS

class Success extends Error
{
    constructor(msg)
    {
        super(msg)

        this.name = 'Success'
    }
}