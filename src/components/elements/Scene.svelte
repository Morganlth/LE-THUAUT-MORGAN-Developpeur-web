<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _colors

    // #IMPORTS

        // --SVELTE
        import { onMount } from 'svelte'

        // --COMPONENT-ELEMENT
        import Decor from './Decor.svelte'
        import Die from './Die.svelte'

    // #VARIABLES

        // --ELEMENT-SCENE
        let
        scene,
        scale
</script>

<!-- #HTML -->

<div
class="scene"
style:transform="scale({scale})"
bind:this={scene}
>
    <Decor
    {_colors}
    />

    <div
    class="content"
    >
        <Die
        _offsetTop={0}
        _color={_colors.light}
        />

        <p>CE DÉ NE SERT ABSOLUMENT A RIEN.</p>
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

        transition: transform 1s;

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
                @include text-info;

                margin: 30px 0;
                padding: 15px 0;
            }
        }
    }
</style>