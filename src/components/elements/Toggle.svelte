<!-- #SCRIPT -->

<script>
    // #EXPORT

        // #PROP
        export let _check = false
</script>
<!-- #HTML -->

<label
class="toggle"
>
    <input
    type="checkbox"
    checked={_check}
    on:click|stopPropagation
    >

    <slot />

    <span></span>
</label>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/font.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #GROUPS */

    .toggle
    {
        @include flex;
        @include f-a-center;
        @include text-info($light);
        @include no-event;

        gap: 10px;

        input
        {
            display: none;

            &:checked
            + span::after
            {
                transform: translateX(100%);

                background-color: $primary;
            }
        }

        span
        {
            @include relative;

            width: 30px;
            height: 16px;

            background-color: $dark;

            border-right: solid $light 2px;
            border-bottom: solid $light 2px;

            box-sizing: border-box;
        }
        span::after
        {
            @include xy-start(true);
            @include any-h;
        
            content: '';

            width: 50%;

            background-color: $secondary;

            transition: transform 400ms;
        }
    }
</style>