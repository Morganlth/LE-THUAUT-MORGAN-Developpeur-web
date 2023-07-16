<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _fill = false
</script>

<!-- #HTML -->

<svg
viewBox="0 0 80 80"
fill={_fill ? 'var(--icon-color)' : 'none'}
stroke="var(--icon-color)"
stroke-width="15"
xmlns="http://www.w3.org/2000/svg"
>
    <circle cx="40" cy="40" r="32.5" />
</svg>

{#if !_fill}
    <!-- #STYLE -->

    <style>
        svg
        {
            stroke-dasharray: 300%;
            stroke-dashoffset: 300%;

            animation: draw .3s ease-in forwards;
        }

        @keyframes draw { to { stroke-dashoffset: 0%; } }
    </style>
{/if}