<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/console.scss'

        // --CONTEXT
        import { app } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // --JS
        import AppError from '../../assets/js/utils/error'

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE
    
    const children = []

    // #VARIABLES

        // --THIS
        let
        cmd,
        input,
        mirror,
        value

        // --MEMORY
        let
        history = ['app'],
        i = 0

    // #FUNCTIONS

        // --CYCLES
        function set()
        {
            cmd.input = input
            cmd.analyse = analyse

            app.cmd = cmd
        }

        function reset()
        {
            update('remove')
            value = ''
            cmd.scrollTop = cmd.scrollHeight - cmd.offsetHeight
        }

        function restore()
        {
            const
            command = history[i],
            length = command.length

            value = command
            input.focus()
            input.setSelectionRange(length, length)
            inputEvent()
        }

        function update(action, values = [])
        {
            children[0].classList[action]('app-context')

            for (let i = 0; i < children.length; i++) children[i].innerText = values[i] ?? ''
        }

        // --EVENTS
        function inputEvent()
        {
            (value.length === 3 || value[3] === ' ') && value.substring(0, 3) === 'app'
            ? analyse(value)
            : update('remove', [value])
        }

        function keyup(e)
        {
            const key = e.key

            switch (key)
            {
                case 'Enter':
                    if (children[0].innerText === 'app') execute()
                    break
                case 'ArrowUp':
                    if (--i < 0) i = 0
                    restore()
                    break
                case 'ArrowDown':
                    if (++i >= history.length) i = history.length-1
                    restore()
                    break
                default: break
            }
        }

        // --COMMAND-CODE
        function analyse(value)
        {
            const values = value.match(/^(app)(\s+\S*)?(\s.*)?$/)

            values.shift()

            if (values[1]) check(values[1])

            update('add', values)
        }

        function check(value) { children[1].classList[app.keyWords.includes(value.trim()) ? 'add' : 'remove']('func-context') }

        function execute()
        {
            const
            func = children[1].innerText.trim(),
            params = children[2].innerText.trim().split(',')

            history.push(value)
            i = history.length

            try
            {
                app[func](...params)

                reset()
            }
            catch (e)
            {
                const err = e instanceof AppError ? e : new AppError('TypeError', `"${func}" n'est pas une fonction valide`)
                
                app.log(err)
            }
        }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="console"
on:mouseenter={spring.spring_mouseEnter.bind(spring)}
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
>
    <section>
        <h3>CONSOLE</h3>

        <p>RECHERCHER & MODIFIER</p>
    </section>

    <div
    class="cmd"
    bind:this={cmd}
    >
        <div
        class="line"
        >
            <div
            class="line-indicator"
            >
                &gt
            </div>

            <div
            class="line-content"
            >
                <input
                type="text"
                maxlength="59"
                spellcheck="false"
                bind:this={input}
                bind:value={value}
                on:input={inputEvent}
                on:keyup|preventDefault={keyup}
                />

                <div
                class="mirror"
                bind:this={mirror}
                >
                    {#each [0, 1, 2] as child}
                        <pre
                        bind:this={children[child]}
                        >
                        </pre>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #GROUPS */

    .console
    {
        @include flex;
        @include f-column;
        @include any-w;

        gap: 20px;

        max-height: 250px;
        height: auto;

        padding-inline: 3%;

        box-sizing: border-box;

        section
        {
            @include flex;

            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;

            gap: 5px;
        }

        h3 { @include h-2; }

        p { @include p-interact; }

        .cmd
        {
            @include any;
    
            overflow: auto;

            padding-bottom: 10px;

            border-right: solid $secondary 2px;
            border-bottom: solid $secondary 2px;

            box-sizing: border-box;

            &::-webkit-scrollbar
            {
                width: 5px;
                height: 5px;

                background-color: $dark;
            }
            &::-webkit-scrollbar-thumb { background-color: $s-light; }
            &::-webkit-scrollbar-corner { background-color: $secondary; }
        }

        @include media-min(768px)
        {
            width: 70%;
            max-height: none;
            height: 60%;

            padding: 30px 30px 20px 20px;

            backdrop-filter: blur(5px);
        }
        @include media-min(1440px)
        {
            width: 50%;
            height: 50%;
        }
    }
</style>