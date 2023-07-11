
<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // --SCSS
        import '../../assets/scss/projects/ninacarducci/style.scss'

        // --JS
        import { map } from '../../assets/js/projects/ninacarducci/land/map'
        import { windowEvent } from '../../assets/js/projects/ninacarducci/land/window'
        import { slider } from '../../assets/js/projects/ninacarducci/body/slider'
        import { gallery } from '../../assets/js/projects/ninacarducci/body/gallery'
        

        // --SVELTE
        import { onMount } from 'svelte'
        import { page } from '$app/stores'

    // #CONSTANTE

        // --TO-ITERATE
        const
        sliderItems =
        [
            {
                src: 'ryoji-iwata-wUZjnOv7t0g-unsplash',
                alt: 'Ryoji Iwata',
                translateX: 100
            },
            {
                src: 'nicholas-green-nPz8akkUmDI-unsplash',
                alt: 'Nicholas Green',
                translateX: 200
            },
            {
                src: 'edward-cisneros-3_h6-1NPDGw-unsplash',
                alt: 'Edward Cisneros',
                translateX: 0
            }
        ]

    // #VARIABLES

        // --ELEMENT-SLIDER
        let
        target = 0,
        timeout

    // #FUNCTIONS

        // --SET
        function set()
        {
            map.set()
            windowEvent.set()
    
            slider.set()
            gallery.set(
                {
                    columns: {
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 3
                    },
                    lightBox: true,
                    lightboxId: 'myAwesomeLightbox',
                    showTags: true,
                    tagsPosition: 'top'
                }
            )
        }

        // --UPDATE
        function updateSlider(a)
        {
            const length = sliderItems.length
    
            for (let i = 0; i < length; i++)
            {
                const
                item = sliderItems[i],
                translateX = (item.translateX + 100 * a) % (length * 100),
                duration = (a === 1 && translateX === 0) || (a === 2 && translateX === (length - 1) * 100) ? 0 : .6

                if (translateX === 100) target = i

                sliderItems[i] = { ...item, translateX: translateX, duration: duration }
            }
        }
       
        function updateSliderTo(id)
        {
            let a = id - target

            switch (a)
            {
                case -2:
                case 1:
                    a = 2
                    break
                case -1:
                case 2:
                    a = 1
                    break
                default:
                    break
            }
    
            updateSlider(a)

            target = id
        }
    
        // --EVENTS
        function slider_click(id)
        {
            if (timeout) return

            timeout = setTimeout(() => timeout = null, 600)

            referral.call(this, id)
        }

        // --REFERRAL
        function referral(id)
        {
            switch (this)
            {
                case 'c':
                    updateSliderTo(id)
                    break
                case 'p':
                    updateSlider(1)
                    break
                case 'n':
                    updateSlider(2)
                    break
                default:
                    break
            }
        }

    // #CYCLE

    // onMount(set)
</script>

<!-- #HTML -->
<svelte:head>
    <!-- #META -->

        <!-- --META-OG -->
        <meta property="og:title" content="Nina Carducci - photographe">
        <meta property="og:type" content="website">
        <meta property="og:description" content="
        Photographe - Photographies Bordeaux - Saisissez ces merveilleux moments au travers de mon regard et de ma technique.
        Rendez les intemporels grâce à la photo, pour se les remémorer.">
        <meta property="og:locale" content="fr_FR">
        <meta property="og:image" content="{$page.url.origin}/src/assets/images/projects/ninacarducci/nina-meta.png">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="627">
        <meta property="og:image:alt" content="Nina Carducci - photographe">
        <!-- --META-TWITTER -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@Nina-Carducci-photographe">
        <meta name="twitter:creator" content="@Nina-Carducci">
        <meta name="twitter:title" content="Nina Carducci - photographe">
        <meta name="twitter:description" content="
        Photographe - Photographies Bordeaux - Saisissez ces merveilleux moments au travers de mon regard et de ma technique.
        Rendez les intemporels grâce à la photo, pour se les remémorer.">
        <meta name="twitter:image" content="{$page.url.origin}/src/assets/images/projects/ninacarducci/nina-meta.png">
    
    <!-- #FONT -->

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Spectral:ital,wght@0,400;1,300;1,400;1,800&display=block" rel="stylesheet">

    <!-- #TITLE-->

    <title>Nina Carducci - photographe</title>
</svelte:head>

<div
id="nina-carducci"
>
	<div
    class="body"
    itemscope
    itemtype="https://schema.org/LocalBusiness"
    >
		<header>
			<a
            href="./project/ninacarducci"
            >
				<h1
                itemprop="name"
                >
                    Nina Carducci
                </h1>
			</a>
		
			<nav>
				<ul>
					<li>
                        <a
                        href="#about"
                        >
                            À propos
                        </a>
                    </li>
					<li>
                        <a
                        href="#gallery"
                        >
                            Galerie
                        </a>
                    </li>
					<li><a
                        href="#services"
                        >
                            Service
                        </a>
                    </li>
					<li><a
                        href="#contact"
                        >
                            Contact
                        </a>
                    </li>
					<li>
						<a
                        href="https://www.instagram.com/ninacarducci.photo/?hl=fr"
                        target="_blank"
                        >
							<img
                            src="{$page.url.origin}/src/assets/images/projects/ninacarducci/instagram.png"
                            alt="Instagram"
                            width="20"
                            height="20"
                            >
						</a>
					</li>
				</ul>
			</nav>
		</header>

		<main>
            <div
            class="top bloc"
            >
                <div
                class="slider"
                >
                    <nav>
                        {#each [0, 1, 2] as id}
                            <button
                            type="button"
                            class:active={target === id}
                            on:click={slider_click.bind('c', id)}
                            >
                            </button>
                        {/each}
                    </nav>

                    <div
                    itemscope
                    itemtype="https://schema.org/ImageGallery"
                    itemprop="subjectOf"
                    >
                        {#each sliderItems as item}
                            <div
                            class="slider-item"
                            style:transition-duration="{item.duration}s"
                            style:transform="translateX({item.translateX - 100}%)"
                            >
                                <img
                                srcset="
                                {$page.url.origin}/src/assets/images/projects/ninacarducci/slider/{item.src}-1920.jpg 1920w,
                                {$page.url.origin}/src/assets/images/projects/ninacarducci/slider/{item.src}-1440.jpg 1440w,
                                {$page.url.origin}/src/assets/images/projects/ninacarducci/slider/{item.src}-1024.jpg 1024w,
                                {$page.url.origin}/src/assets/images/projects/ninacarducci/slider/{item.src}-768.jpg 768w,
                                {$page.url.origin}/src/assets/images/projects/ninacarducci/slider/{item.src}-425.jpg 425w"
                                sizes="(min-width: 1441px) 1920px, (min-width: 1025px) 1440px, (min-width: 769px) 1024px, (min-width: 426px) 768px, 425px"
                                src="{$page.url.origin}/src/assets/images/projects/ninacarducci/slider/{item.src}-1920.jpg"
                                alt={item.alt}
                                width="1920"
                                height="888"
                                itemprop="image"
                                >
                            </div>
                        {/each}

                        <button
                        class="prev"
                        type="button"
                        on:click={slider_click.bind('p')}
                        >
                            <img
                            src="{$page.url.origin}/src/assets/images/projects/ninacarducci/icons/carousel-control-prev-icon.svg"
                            alt="prev button"
                            width="16"
                            height="27"
                            >
                        </button>
            
                        <button
                        class="next"
                        type="button"
                        on:click={slider_click.bind('n')}
                        >
                            <img
                            src="{$page.url.origin}/src/assets/images/projects/ninacarducci/icons/carousel-control-next-icon.svg"
                            alt="next button"
                            width="16" 
                            height="27"
                            >
                        </button>
                    </div>
                </div>
            
                <div
                class="about"
                >
                    <picture>
                        <source
                        media="(min-width: 1180px)"
                        srcset="{$page.url.origin}/src/assets/images/projects/ninacarducci/nina.png 560w"
                        sizes="560px"
                        >
                        <source
                        media="(min-width: 650px)"
                        srcset="{$page.url.origin}/src/assets/images/projects/ninacarducci/nina-420.png 420w"
                        sizes="420px"
                        >
                        <source
                        media="(max-width: 650px)"
                        srcset="{$page.url.origin}/src/assets/images/projects/ninacarducci/nina-224.png 224w"
                        sizes="224px"
                        >
                        <img
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/nina.png 560w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/nina-420.png 420w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/nina-224.png 224w"
                        sizes="(min-width: 1180px) 559px, (min-width: 650px) 419px, 223px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/nina.png"
                        alt="moi - Nina Carducci"
                        width="560"
                        height="558"
                        itemprop="image"
                        >
                    </picture>
            
                    <article
                    itemprop="description"
                    >
                        <h2>À propos de moi</h2>
                
                        <em>
                            Devenir photographe était pour moi une évidence. Comme si j’y étais prédestiné. Saisir un moment, une émotion, une situation, un endroit, une lumière et les rendre immortels,
                            voilà ce qui me fait vibrer.
                        </em>

                        <p>
                            Nous passons notre vie à chercher le bonheur, et lorsque nous y touchons, nous n’avons qu’une envie : le figer au travers de photographies pour le savourer avec les personnes
                            qui sont importantes à nos yeux, ou le partager au plus grand nombre.
                            C’est ce que je vous propose : saisir ces merveilleux moments au travers de mon regard, mon approche, ma technique. Rendre ces moments immortels, afin que vous puissiez y 
                            puiser de l’amour, du bonheur, de la tendresse et de lumière à chaque fois que vous poserez les yeux sur vos photos.
                        </p>
                    </article>
                </div>
            </div>

            <div
            class="mid bloc"
            >
                <section
                class="gallery"
                itemscope
                itemtype="https://schema.org/ImageGallery"
                itemprop="subjectOf"
                >
                    <h2
                    itemprop="name"
                    >
                        Portfolio
                    </h2>
                
                    <div class="container">
                        <img data-gallery-tag="Concert"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/aaron-paul-wnX-fXzB6Cw-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/aaron-paul-wnX-fXzB6Cw-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/aaron-paul-wnX-fXzB6Cw-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/aaron-paul-wnX-fXzB6Cw-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/aaron-paul-wnX-fXzB6Cw-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/aaron-paul-wnX-fXzB6Cw-unsplash.jpg"
                        alt="Aaron Paul Concert" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Entreprises"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/ali-morshedlou-WMD64tMfc4k-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/ali-morshedlou-WMD64tMfc4k-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/ali-morshedlou-WMD64tMfc4k-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/ali-morshedlou-WMD64tMfc4k-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/ali-morshedlou-WMD64tMfc4k-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/ali-morshedlou-WMD64tMfc4k-unsplash.jpg"
                        alt="Ali Morshedlou entreprise" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Entreprises"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/jason-goodman-tHO1_OuKbg0-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/jason-goodman-tHO1_OuKbg0-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/jason-goodman-tHO1_OuKbg0-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/jason-goodman-tHO1_OuKbg0-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/jason-goodman-tHO1_OuKbg0-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/jason-goodman-tHO1_OuKbg0-unsplash.jpg"
                        alt="Jason Goodman entreprise" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Mariages"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/hannah-busing-RvF2R_qMpRk-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/hannah-busing-RvF2R_qMpRk-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/hannah-busing-RvF2R_qMpRk-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/hannah-busing-RvF2R_qMpRk-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/hannah-busing-RvF2R_qMpRk-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/hannah-busing-RvF2R_qMpRk-unsplash.jpg"
                        alt="Hannah Busing mariage" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Portrait"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/ade-tunji-rVkhWWZFAtQ-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/ade-tunji-rVkhWWZFAtQ-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/ade-tunji-rVkhWWZFAtQ-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/ade-tunji-rVkhWWZFAtQ-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/ade-tunji-rVkhWWZFAtQ-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/ade-tunji-rVkhWWZFAtQ-unsplash.jpg"
                        alt="Ade Tunji portrait" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Mariages"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/jakob-owens-SiniLJkXhMc-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/jakob-owens-SiniLJkXhMc-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/jakob-owens-SiniLJkXhMc-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/jakob-owens-SiniLJkXhMc-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/jakob-owens-SiniLJkXhMc-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/mariage/jakob-owens-SiniLJkXhMc-unsplash.jpg"
                        alt="Jakob Owens mariage" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Portrait"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/nino-van-prattenburg--443cl1uR_8-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/nino-van-prattenburg--443cl1uR_8-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/nino-van-prattenburg--443cl1uR_8-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/nino-van-prattenburg--443cl1uR_8-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/nino-van-prattenburg--443cl1uR_8-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/portraits/nino-van-prattenburg--443cl1uR_8-unsplash.jpg"
                        alt="Nino Van Prattenburg portrait" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Concert"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/austin-neill-hgO1wFPXl3I-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/austin-neill-hgO1wFPXl3I-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/austin-neill-hgO1wFPXl3I-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/austin-neill-hgO1wFPXl3I-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/austin-neill-hgO1wFPXl3I-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/concerts/austin-neill-hgO1wFPXl3I-unsplash.jpg"
                        alt="Austin Neill concert" width="424" height="424" itemprop="image">
                        <img data-gallery-tag="Entreprises"
                        srcset="
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/mateus-campos-felipe-Fsgzm8N0hIY-unsplash-424.jpg 424w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/mateus-campos-felipe-Fsgzm8N0hIY-unsplash-364.jpg 364w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/mateus-campos-felipe-Fsgzm8N0hIY-unsplash-304.jpg 304w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/mateus-campos-felipe-Fsgzm8N0hIY-unsplash-224.jpg 224w,
                        {$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/mateus-campos-felipe-Fsgzm8N0hIY-unsplash-254.jpg 254w"
                        sizes="(min-width: 1400px) 423px, (min-width: 1200px) 363px, (min-width: 992px) 303px, (min-width: 768px) 223px, (min-width: 576px) 253px, 423px"
                        src="{$page.url.origin}/src/assets/images/projects/ninacarducci/gallery/entreprise/mateus-campos-felipe-Fsgzm8N0hIY-unsplash.jpg"
                        alt="Mateus Campos Felipe entreprise" width="424" height="424" itemprop="image">
                    </div>
    
                    <article class="quote after-gallery">
                        <figure itemscope itemtype="https://schema.org/Quotation" itemprop="subjectOf">
                            <blockquote>
                                <h2 class="quote__text h1" itemprop="citation">
                                    Un portrait n’est pas une ressemblance. Dès lors qu’une émotion ou qu’un fait est traduit en photo, il cesse d’être un fait pour devenir une opinion.
                                    L’inexactitude n’existe pas en photographie. Toutes les photos sont exactes. Aucune d’elles n’est la vérité.
                                </h2>
                            </blockquote>
                            <figcaption class="quote__author" itemprop="author">- Richard Avedon</figcaption>
                        </figure>
                    </article>
                </section>
            </div>

            <div
            class="bottom bloc"
            >

            </div>

			<section id="services" class="after-slider after-gallery">
				<h2 class="title">Mes services</h2>

				<div class="container">
					<article class="service" itemscope itemtype="https://schema.org/Offer" itemprop="makesOffer">
						<div class="service__description">
							<h3 itemprop="itemOffered">Shooting photo</h3>
							<p itemprop="description">Pour capturer vos moments les plus précieux et garder un souvenir impérissable. Je me déplace en Île-de-France pour réaliser vos photos</p>
						</div>

						<div class="service__price" itemscope itemtype="https://schema.org/PriceSpecification" itemprop="priceSpecification">
							<h4 itemprop="price">350€/demi journée</h4>
							<span itemprop="description">Matériel, déplacement inclus</span>
						</div>
					</article>

					<article class="service" itemscope itemtype="https://schema.org/Offer" itemprop="makesOffer">
						<div class="service__description">
							<h3 itemprop="itemOffered">Retouches</h3>
							<p itemprop="description">Vous souhaitez retoucher vos photos pour un résultat professionnel ? Bénéficier d’un rendu optimal pour vos publications</p>
						</div>

						<div class="service__price" itemscope itemtype="https://schema.org/PriceSpecification" itemprop="priceSpecification">
							<h4 itemprop="price">50€/photo</h4>
							<span itemprop="description">2 AR par photo</span>
						</div>
					</article>

					<article class="service" itemscope itemtype="https://schema.org/Offer" itemprop="makesOffer">
						<div class="service__description">
							<h3 itemprop="itemOffered">Album photos</h3>
							<p itemprop="description">Partagez avec vos proches et vos clients les photos des moments partagés ensemble à travers un album photo personnalisé</p>
						</div>

						<div class="service__price" itemscope itemtype="https://schema.org/PriceSpecification" itemprop="priceSpecification">
							<h4 itemprop="price">400€ album A4</h4>
							<span itemprop="description">30 pages recto/verso</span>
						</div>
					</article>
				</div>
			</section>

			<article class="quote after-slider after-gallery">
				<figure itemscope itemtype="https://schema.org/Quotation" itemprop="subjectOf">
					<blockquote>
						<h2 class="quote__text h1" itemprop="citation">
							De manière inconsciente, je crois, je guette un regard, une expression, des traits ou une nostalgie capable de résumer ou plus exactement de révéler une vie
						</h2>
					</blockquote>
					<figcaption class="quote__author" itemprop="author">- Richard Avedon</figcaption>
				</figure>
			</article>
		</main>

		<footer id="contact" class="after-slider after-gallery">
			<div class="container">
				<section class="form-container">
					<h2>Une question ? Une demande de devis ?</h2>
					<p> N’hésitez pas à m’écrire ! Je vous répondrais en moins de 24 heures</p>
					
					<form action="#" method="post">
						<label for="nom">Nom</label>
						<input type="text" name="nom" id="nom">

						<label for="email">Email</label>
						<input type="email" name="email" id="email">

						<label for="message">Message</label>
						<textarea name="message" id="message" cols="30" rows="10"></textarea>

						<input type="submit" value="Envoyer">
					</form>
				</section>

				<picture class="picture right">
					<source media="(min-width: 1180px)" srcset="{$page.url.origin}/src/assets/images/projects/ninacarducci/camera.png 419w" sizes="419px">
					<source media="(min-width: 650px)" srcset="{$page.url.origin}/src/assets/images/projects/ninacarducci/camera-279.png 279w" sizes="279px">
					<source media="(max-width: 650px)" srcset="{$page.url.origin}/src/assets/images/projects/ninacarducci/camera-159.png 159w" sizes="159px">
					<img srcset="
					{$page.url.origin}/src/assets/images/projects/ninacarducci/camera.png 419w,
					{$page.url.origin}/src/assets/images/projects/ninacarducci/camera-279.png 279w,
					{$page.url.origin}/src/assets/images/projects/ninacarducci/camera-159.png 159w"
					sizes="(min-width: 1180px) 418px, (min-width: 650px) 279px, 158px"
					src="{$page.url.origin}/src/assets/images/projects/ninacarducci/camera.png" alt="Caméra" width="419" height="418">
				</picture>
			</div>

			<div class="infos container">
				<section>
					<h2>Adresse</h2>

					<p itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
						<span itemprop="streetAddress">68 avenue Alsace-Lorraine</span> <br>
						<span itemprop="postalCode">33200</span>
						<span itemprop="addressLocality">Bordeaux</span>
					</p>
				</section>

				<section>
					<h2>Contact</h2>

					<p>
						téléphone <br>
						<span itemprop="telephone">05 56 67 78 89</span>
					</p>
				</section>

				<section>
					<h2>Horaires</h2>

					<p itemprop="openingHours" content = "Mo, Tu, We, Th, Fr 10:00-19:00">
						Du lundi au vendredi <br>
						de 10h à 19h.
					</p>
				</section>

				<section>
					<h2>Tarifs</h2>

					<p>
						<span itemprop="priceRange">50€ à 400€</span> <br>
						<a href="#services">voir mes services</a>
					</p>
				</section>
			</div>
		</footer>
	</div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    #nina-carducci
    {
        width: 100%;

        background-color: white;
    }
    .body
    {
        max-width: 1920px;

        margin: auto;

        font-family: 'Inter', sans-serif;
    }

    h1, h2 { font-weight: 500; }
    h2 { font-size: 2rem; }

    a
    {
        color: #330808;
        text-decoration: none;
    }

    header
    {
        display: flex;
        justify-content: space-between;
        align-items: center;

        position: sticky;
        top: 0;
        left: 0;

        z-index: 5;

        padding: 30px 100px;

        background-color: white;

        box-sizing: border-box;

        h1
        {
            font-size: 1.6em;
            line-height: 1.2;
        }

        nav ul
        {
            display: flex;
            align-items: center;

            font-size: 14px;

            li { padding-inline: 10px; }
        }
    }

    .bloc { width: 100%; }

    .slider
    {
        position: relative;

        width: 100%;
        height: 888px;
        
        nav
        {
            position: absolute;
            
            bottom: 16px;
            left: 50%;

            z-index: 4;

            transform: translateX(-50%);

            button
            {
                opacity: .5;
    
                width: 30px;
                height: 3px;

                margin: 0 3px;

                background-color: #fff;
                background-clip: padding-box;

                border-top: solid transparent 10px;
                border-right: 0;
                border-bottom: solid transparent 10px;
                border-left: 0;

                box-sizing: content-box;

                cursor: pointer;

                transition: opacity .6s ease;
            }
            button.active { opacity: 1; }
        }

        &
        >div
        {
            position: relative;

            width: 100%;
            height: 100%;

            .slider-item
            {
                position: absolute;
    
                top: 0;
                left: 0;
        
                width: 100%;
                height: 100%;

                transition: transform ease-in-out;
            }
    
            button
            {
                display: flex;
                justify-content: center;
                align-items: center;
    
                position: absolute;

                top: 0;

                z-index: 4;

                opacity: .5;

                width: 15%;
                height: 100%;

                background-color: transparent;

                border: none;
                outline: none;

                cursor: pointer;

                &:hover { opacity: 1; }
        
                img
                {
                    vertical-align: middle;
    
                    width: 16px;
                    height: 27px;
                }
            }
            .prev { left: 0; }
            .next { right: 0; }
        }
    }

    .about
    {
        display: flex;

        position: relative;

        width: 100%;

        padding: 100px;

        background-color: #f6d2b8;

        box-sizing: border-box;

        picture
        {
            z-index: 0;
        
            width: 560px;
            height: 558px;

            margin: 0 20px;

            &::before
            {
                content: '';

                position: absolute;

                bottom: 0;
                left: 0;

                z-index: -1;
    
                width: 374px;
                height: 329px;

                background-color: #e5975f;
            }
        }

        article
        {
            h2 { margin: 1em 0 60px; }

            em
            {
                display: block;
    
                width: 60%;

                margin-bottom: 0.5rem;
        
                font-family: Spectral, sans-serif;
                font-size: 1rem;
                font-weight: 800;
                font-style: italic;
                line-height: 1.2;
            }

            p
            {
                width: 80%;

                font-size: 14px;
            }
        }
    }

    .gallery
    {
        width: 100%;

        h2
        {
            padding-block: 2em;

            text-align: center;
        }

        .container
        {
            position; absolute
        }
    }
</style>