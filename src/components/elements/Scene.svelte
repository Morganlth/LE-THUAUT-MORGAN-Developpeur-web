<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _scale,
        _colors

        // --BIND
        export let number

    // #IMPORTS

        // --CONTEXT
        import { event } from '../field/Main.svelte'

        // --SVELTE
        import { onMount, onDestroy } from 'svelte'

        // --COMPONENT-ELEMENTS
        import Decor from './Decor.svelte'
        import Die from './Die.svelte'

    // #VARIABLES

        // --ELEMENT-SCENE
        let
        scene,
        offsetTop

    // #FUNCTIONS

        // --SET
        function set()
        {
            offsetTop = scene.offsetTop

            setEvent()
        }

        function setEvent() { event.event_add('scroll', scene_scroll) }

        // --DESTROY
        function destroy() { event.event_remove('scroll', scene_scroll) }

        // --EVENT
        async function scene_scroll() { offsetTop = scene.offsetTop }

    // #CYCLES

    onMount(set)
    onDestroy(destroy)
</script>

<!-- #HTML -->

<div
class="scene"
bind:this={scene}
>
    <Decor
    {_scale}
    {_colors}
    />

    <div
    class="content"
    >
        <Die
        _offsetTop={offsetTop}
        _color={_colors.light}
        bind:number={number}
        />

        <p>CE DÉ NE SERT ABSOLUMENT A RIEN. (EN COURS DE DÉVELOPPEMENT)</p>
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex.scss' as *;
    @use '../../assets/scss/styles/position.scss' as *;
    @use '../../assets/scss/styles/size.scss' as *;
    @use '../../assets/scss/styles/font.scss' as *;

    /* #GROUPS */

    .scene
    {
        @include sticky(true);
        @include any-w;

        height: 100vh;

        .content
        {
            @include flex;
            @include f-column;
            @include f-a-center;
            @include absolute;
            @include any-w;

            justify-content: flex-end;

            bottom: 0;
            left: 0;

            height: 30vh;

            p
            {
                @include p-interact;

                margin: 30px 0;
                padding: 15px 0;
            }
        }
    }
</style>