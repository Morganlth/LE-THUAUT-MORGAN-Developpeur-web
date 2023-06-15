// #IMPORTS

import AppSuccess from './success'
import AppError from './error'

// #APP CLASS

export default class App
{
    keyWords = ['log', 'clear', 'reset', 'success', 'error', 'effect']
    storageKeys = ['effect']

    constructor(cmd) { this.cmd = cmd }

    add(name, command, storage)
    {
        if (!this.keyWords.includes(name)) this.keyWords.push(name)
        if (storage && !this.storageKeys.includes(name)) this.storageKeys.push(name)

        this[name] = command
    }

    testDefault(value) { return value === 'd' || value === 'default' }

    testNumber(n, min, max)
    {
        if (!/^\d*?\.?\d+$/.test(n)) this.error('la valeur doit être un nombre', 'TypeError')
        if (n < min || n > max) this.error(`la valeur doit être comprise entre [${min} et ${max}]`, 'RangeError')

        return parseInt(n, 10)
    }

    log(msg)
    {
        const type = msg instanceof Error ? msg instanceof AppSuccess ? 'success' : 'error' : null

        this.cmd.lastChild.insertAdjacentHTML('beforebegin', `
            <div class="line">
                <div class="line-indicator"></div>
                <div class="line-content">
                    ${type ? `
                    <span class="console-${type}">${msg.name}:</span>
                    <pre class="console-result">${msg.message.trim()}</pre>` : `
                    <pre class="console-result">${msg.trim()}</pre>`}
                </div>
            </div>
        `)
    }

    clear()
    {
        const children = [...this.cmd.children]

        for (let i = children.length - 2; i >= 0; i--) this.cmd.removeChild(children[i])
    }

    reset(view)
    {
        for (const key of this.storageKeys) this[key]('d')

        if (!view) this.clear()
    }

    success(msg) { this.log(new AppSuccess(msg)) }
    
    error(msg, type) { throw new AppError(type ?? 'Error', msg) }

    effect(n)
    {
        n = this.testDefault(n) ? .3 : this.testNumber(n, 0, 1)

        document.querySelector(':root').style.setProperty('--effect', n)
        localStorage.setItem('effect', n)
    
        this.success('effet ' + n)
    }
}