//IMPORTS

import { windowEvent } from '../land/window.js'
import { map } from '../land/map.js'

//EXPORT

export const gallery =
{
    set(options)
    {
        setVar()

        map.add(NAME, elementAfterGallery)

        setStaticFields(options)
        clearGallery()
        appendGalleries()
        createLightBox()
        showItemTags()
        setEvents()
        hideOrShow()
    }
}

//CONSTANTES

const
NAME = 'gallery',
TAGS = ['Tous'],
GALLERIES = []

let
columns = 3,
lightbox = true,
lightboxId = null,
loadedImg = true,
showtags = true,
tagsPosition = 'bottom',
navigation = true,
ruleTags = () => {}

//VARIABLES

let
container,
elementAfterGallery

//FUNCTIONS

function setVar()
{
    container = document.querySelector('.gallery-container')
    elementAfterGallery = [...document.querySelectorAll('.after-gallery')]
}

function getOptions() //retourne les options pour le constructor de la Gallery => tag + images + active
{
    const options = [{ tag: 'Tous', images: [], active: true }]

    container.querySelectorAll('img').forEach(img =>
    {
        const tag = img.getAttribute('data-gallery-tag'), theTagExists = testOpt(options, tag, img)

        if (!theTagExists) newOpt(options, tag, img)

        options[0].images.push(img)
    })

    return options
}

function testOpt(options, tag, img)
{
    let theTagExists = false

    for (const opt of options)
    {
        if (opt.tag === tag)
        {
            theTagExists = true
            opt.images.push(img)

            break
        }
    }

    return theTagExists
}

function newOpt(options, tag, img)
{
    TAGS.push(tag)
    options.push({ tag: tag, images: [img], active: false })
}

function setStaticFields(options)
{
    for (const opt in options)
    {
        switch (opt)
        {
            case 'columns': columns = options[opt]; break
            case 'lightbox': lightbox = options[opt]; break
            case 'lightboxId': lightboxId = options[opt]; break
            case 'showTags': showtags = options[opt]; break
            case 'tagsPosition': tagsPosition = options[opt]; break
            case 'navigation': navigation = options[opt]; break
            default: break
        }
    }

    GALLERIES.push(...getAllGallery())
}

function getAllGallery()
{
    class Gallery extends HTMLElement
    {
        constructor(options)
        {
            super()
        
            this.tag = options.tag
            this.images = options.images
            this.active = options.active

            this.createRowWrapper()
            this.wrapItemInColumn()
        }

        createRowWrapper() { this.className = 'gallery-items-row row position-absolute start-0 w-100' }

        wrapItemInColumn()
        {
            if (columns instanceof Number) this.wrap(`col-${Math.ceil(12 / columns)}`)
            else if (columns instanceof Object)
            {
                let columnClasses = ""

                for (const column in columns) columnClasses += getColumnClass(column, columns[column])
                
                this.wrap(columnClasses)
            }
            else { console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`) }
        }

        wrap(columnClasses)
        {
            this.images.forEach(img =>
            {
                const div = document.createElement('div')
                img = img.cloneNode()

                div.className = `item-column mb-4${columnClasses}`
                div.appendChild(img)
                this.appendChild(div)
            })
        }

        hide()
        {
            this.style.display = 'none'
            this.active = false
        }

        show()
        {
            this.style.display = 'flex'
            this.active = true

            const height = this.offsetHeight + container.offsetHeight

            map.write(NAME, height)
            map.reader() //attention reader doit etre appelé au chargement de la page ce qui est fait ici
            fadeIn(this, 300)
        }
    }

    if (!customElements.get('gallery-area')) customElements.define('gallery-area', Gallery)

    const options = getOptions(), galleries = []

    options.forEach(opt => galleries.push(new Gallery(opt)))

    return galleries
}

function getColumnClass(column, value)
{
    value = Math.ceil(12 / value)

    switch (column)
    {
        case 'xs': return ' col-' + value
        case 'sm': return ' col-sm-' + value
        case 'md': return ' col-md-' + value
        case 'lg': return ' col-lg-' + value
        case 'xl': return ' col-xl-' + value
        default: return 'error-column-parameter'
    }
}

function clearGallery() { container.innerHTML = '' }

function showItemTags()
{
    if (!showtags) return

    const bottomPosition = tagsPosition === 'bottom'
    let tagItems = ''

    TAGS.forEach(tag => tagItems += `<li class="nav-item"><span class="nav-link ${tag === 'Tous' ? 'active-tag' : ''}"  data-images-toggle="${tag}">${tag}</span></li>`) //suppression de 'active' class

    container.insertAdjacentHTML(bottomPosition ? 'beforeend' : 'afterbegin', `<ul class="my-4 tags-bar nav nav-pills ${bottomPosition ? 'after-gallery' : ''}">${tagItems}</ul>`)

    if (bottomPosition) appendRules()
}

function appendRules()
{
    document.querySelector('.gallery>div').style.marginBottom = '80px'
    container.style.height = 0
    ruleTags = (top) => { window.scrollTo({ top: top, left: 0, behavior: 'smooth' })}

    elementAfterGallery.push(container.querySelector('.tags-bar'))
}

function appendGalleries() { GALLERIES.forEach(glr => container.appendChild(glr)) }

function createLightBox()
{
    document.querySelector('#nina-carducci .body').insertAdjacentHTML('beforeend', // Ajout sur le body plutot que dans la gallery pour eviter problemes avec transform avec class "after-slider"
    `
    <div class="modal fade" id="${lightboxId ?? "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
        <div>
            <div class="modal-dialog" role="document">
                ${
                    navigation
                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                    : '<span style="display:none;" />'
                }
                <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique" width="498" height="498"/>
                ${
                    navigation
                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                    : '<span style="display:none;" />'
                }
            </div>
        </div>
    </div>
    `)
}

function setEvents()
{
    windowEvent.add(() => map.write(NAME, getActiveGallery().offsetHeight + container.offsetHeight))

    container.querySelectorAll('img').forEach(item => item.addEventListener('click', openLightBox))

    container.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', filterByTag))

    document.querySelector('.mg-prev').addEventListener('click', () => updateImage(false))
    document.querySelector('.mg-next').addEventListener('click', () => updateImage(true))

    document.querySelector('.lightboxImage').addEventListener('load', () => loadedImg = true)
}

function openLightBox()
{
    if (!lightbox || this.tagName !== "IMG") return

    const modal = document.querySelector('#' + lightboxId)
    
    modal.querySelector('.lightboxImage').setAttribute('src', this.getAttribute('src'))

    updateModal.call(modal)
    modal.addEventListener('click', updateModal)
}

function updateModal(e)
{
    const body = document.querySelector('#nina-carducci .body'), show = this.classList.contains('show')

    if (show) { if (e.target.className.includes('modal')) body.style.overflow = 'auto', body.style.paddingRight = 0, this.style.display = 'none', this.classList.remove('show'), this.removeEventListener('click', updateModal) }
    else { body.style.paddingRight = (window.innerWidth - body.clientWidth) + 'px', body.style.overflow = 'hidden', this.classList.add('show'), this.style.display = 'flex', fadeIn(this, 300) }
}

function filterByTag()
{
    if (this.classList.contains('active-tag')) return

    const tag = this.getAttribute('data-images-toggle'), currentGallery = getActiveGallery(), newGallery = getNewGallery(tag), top = document.getElementById('gallery').offsetTop

    container.querySelector('.active-tag').classList.remove('active-tag')
    this.classList.add('active-tag')

    ruleTags(top)
    currentGallery.hide()
    newGallery.show()
}

function getActiveGallery() { for (const glr of GALLERIES) if (glr.active) return glr }

function getNewGallery(tag) { for (const glr of GALLERIES) if (glr.tag === tag) return glr }

function updateImage(next)
{
    if (loadedImg)
    {
        const images = getActiveGallery().images, currentImage = document.querySelector('.lightboxImage'), currentSrc = currentImage.getAttribute('src')
        let preSrc = null

        for (let i = next ? images.length-1 : 0; next ? i >= 0 : i < images.length; next ? i-- : i++)
        {
            const src = images[i].getAttribute('src')
        
            if (src === currentSrc) break

            preSrc = src
        }

        loadedImg = false
        currentImage.setAttribute('src', preSrc ? preSrc : (next ? images[0] : images[images.length-1]).getAttribute('src'))
    }
}

function hideOrShow() { GALLERIES.forEach(g => g.active ? g.show() : g.hide()) }

function fadeIn(element, delay)
{
    let scale = 10 / delay, count = 0

    element.style.opacity = 0
    element.style.transform = 'scale(0, 0)'

    const interval = setInterval(() =>
    {
        count += scale
        count = count > 1 ? 1 : count

        element.style.opacity = count
        element.style.transform = `scale(${count + ', ' + count})`

        if (count >= 1) clearInterval(interval)
    }, 10)
}