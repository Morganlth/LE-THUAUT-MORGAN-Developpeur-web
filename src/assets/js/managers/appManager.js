// #APP-MANAGER

class AppManager
{
    // #VARIABLES

        // --APP-CONTEXT
        app_TRANSITION
        app_FREEZE
        app_KEYWORDS = ['reset', 'success', 'error', 'fps', 'effect', 'eco']
        app_KEYSTORAGE = ['effect']
        app_COMMANDS = {}
        app_CONFIG_BEFORE_ECO = {}

    // #CONSTRUCTOR

    constructor()
    {
        this.app_TRANSITION = writable(false)
        this.app_FREEZE = writable(false)

        this.app_set()
    }

    // #FUNCTIONS

        // --SET
        app_set()
        {
            for (const KEY of this.app_KEYWORDS)
                this.app_COMMANDS[KEY] = this['app_' + KEY].bind(this)
        }

        app_setConfigBeforeEco()
        {
            this.app_CONFIG_BEFORE_ECO =
            {
                effect: localStorage.getItem('effect'),
                spring: localStorage.getItem('spring'),
                presentationSnake: localStorage.getItem('presentationSnake')
            }
        }
    
        // --RESET
        app_reset(view = false)
        {
            for (const KEY of this.app_KEYSTORAGE) this.app_COMMANDS[KEY]('d')

            if (!view && this.app_KEYWORDS.includes('clear')) this.app_COMMANDS.clear()
        }

        // --UPDATE
        app_update(commands)
        {
            for (const KEY in commands)
                if (this.app_KEYWORDS.includes(KEY)) this.app_COMMANDS[KEY](commands[KEY])

            if (this.app_KEYWORDS.includes('clear')) this.app_COMMANDS.clear()
        }

        app_updateMode(eco)
        {
            const MODE = localStorage.getItem('mode')

            if ((eco && MODE === 'eco') || (!eco && MODE === 'personnalisé')) return

            localStorage.setItem('mode', eco ? 'eco' : 'personnalisé')
        }
        
        // --COMMANDS
        app_success(msg) { if (this.app_KEYWORDS.includes('log')) this.app_COMMANDS.log(new AppSuccess(msg)) }
        
        app_error(msg, type) { throw new AppError(type ?? 'Error', msg) }

        app_effect(n)
        {
            this.app_testDefault(n) ? n = .3 : this.app_testNumber(n, 0, 1)

            document.querySelector(':root').style.setProperty('--effect', n)
            localStorage.setItem('effect', n)
        
            this.app_success('effet ' + n)

            if (n != 0) this.app_updateMode(false)
        }

        async app_fps() { if (this.app_KEYWORDS.includes('log')) this.app_COMMANDS.log(await fps_get() + ' fps') }

        app_eco(eco)
        {
            eco = this.app_testDefault(eco) ? true : this.app_testBoolean(eco)

            if (eco)
            {
                this.app_setConfigBeforeEco()
                this.app_update({ effect: 0, spring: false, presentationSnake: false })
            }
            else this.app_update(this.app_CONFIG_BEFORE_ECO)

            this.app_updateMode(eco)
            this.app_success('Eco mode ' + eco)
        }

        // --TEST
        app_testDefault(value) { return value === 'd' || value === 'default' }

        app_testNumber(value, min, max)
        {
            if (!/^\d*?\.?\d+$/.test(value)) this.app_error('la valeur doit être un nombre', 'TypeError')
            if (value < min || value > max) this.app_error(`la valeur doit être comprise entre [${min} et ${max}]`, 'RangeError')

            return parseInt(value, 10)
        }

        app_testBoolean(value)
        {
            if (value === false || value === 'f' || value === 'false') return false
            else if (value === true || value === 't' || value === 'true') return true
            else this.app_error('"t" | "true" pour vrai - "f" | "false" pour faux', 'TypeError')
        }

        // --UTIL
        app_add(name, command, storage) // ajouter function remove lié aux destroy des elements
        {
            if (!this.app_KEYWORDS.includes(name)) this.app_KEYWORDS.push(name)
            if (storage && !this.app_KEYSTORAGE.includes(name)) this.app_KEYSTORAGE.push(name)

            this.app_COMMANDS[name] = command
        }
}

// #IMPORTS

    // --JS
    import AppSuccess from '../utils/success'
    import AppError from '../utils/error'
    import fps_get from '../utils/fps'

    // --SVELTE
    import { writable } from 'svelte/store'

// #EXPORT

    // --CONTEXT
    export default new AppManager()