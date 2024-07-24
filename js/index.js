const currentPage = document.querySelector('.current')
const cardContainer = document.querySelector('.card-space')
const modalActivate = document.querySelectorAll('.card')

const ApiLocalCopy = []

async function pickCharacter(pageNumber) {
    const searchBar = document.querySelector('#searchBar')

    try {
        const response = await api.get(`character/?page=${pageNumber}`)
        const result = response.data.results
        
        ApiLocalCopy.push(result)

        result.forEach(async personagem => {
            
            let status = await statusClass(personagem.status.toLowerCase())

            searchBar.addEventListener('input', async () => {
                cardContainer.innerHTML = ''
                const filteredCharacters = await result.filter(personagem => personagem.name.toLowerCase().includes(searchBar.value.toLowerCase()))

                filteredCharacters.forEach(async perso => {

                    let status = await statusClass(perso.status.toLowerCase())
    
                    cardContainer.innerHTML += `
                    <div class="col-3 card d-flex align-items-center justify-content-center  my-5 pb-1 m-5 flex-wrap"  onclick = " pickID(${perso.id})">
                    <div class="max-img">
                        <img class='imgMsm' src='${perso.image}'>
                    </div>
                    <div class='pad'>
                        <span class="title-card  text-center">${perso.name}</span>

                        <li class="${status}" > ${perso.status} - ${perso.species}</li>
                        
                    </div>
                </div>
                `
                })
            })

            cardContainer.innerHTML += `
                <div class="col-3 card d-flex align-items-center justify-content-center  my-5 pb-1 mx-2 flex-wrap" onclick = " pickID(${personagem.id})">
                    <div class="max-img">
                        <img class='imgMsm' src='${personagem.image}' data-bs-toggle='modal' data-bs-target='#card-information' >
                    </div>
                    <div class='pad'>
                        <span class="title-card  text-center">${personagem.name}</span>

                        <li class="${status}" > ${personagem.status} - ${personagem.species}</li>
                        
                    </div>
                </div>
            ` 
            
        })
    } catch (error) {
        console.log(error);
    }
}

async function statusGeneral() {
    const pChar = document.querySelector('.char')
    const pLoc = document.querySelector('.loc')
    const pEp = document.querySelector('.ep')

    try {
        const character = await api.get('character')
        const char = character.data.info

        const location = await api.get('location')
        const loc = location.data.info

        const episode = await api.get('episode')
        const ep = episode.data.info

        pChar.innerText = `Personagens: ${char.count}`
        pLoc.innerText = `Localizações: ${loc.count}`
        pEp.innerText = `Episodios: ${ep.count}`

    } catch (error) {
        console.log(error);
    }

}

async function lastEpName(url) {
    try {
        const response = await api.get(`${url}`)
        const result = response.data.name

        return result
    } catch (error) {
        console.log(error);
    }
}

async function page() {
    const response = await api.get('character')
    const result = response.data.info

    let cPage = 1
    const nextPage = document.querySelector('.next')
    const prevPage = document.querySelector('.prev')

    nextPage.addEventListener('click', () => {
        if (result.next != null) {
            cPage++
            currentPage.innerText = cPage
            cardContainer.innerHTML = ''
            pickCharacter(cPage)
        }
    })

    prevPage.addEventListener('click', () => {
        if (cPage > 1) {
            cPage--
            currentPage.innerText = cPage
            cardContainer.innerHTML = ''
            pickCharacter(cPage)
        }

    })

}

async function pickID(id){
    try {
        const response = await api.get(`character/${id}`)
        const foundedPerso = response.data
        const nomeEp = await lastEpName(foundedPerso.episode.pop())
        const stt = await statusClass(foundedPerso.status)

        document.getElementById('perso-image').src = foundedPerso.image
        document.getElementById('perso-name').textContent = foundedPerso.name
        document.getElementById('last-local').textContent = foundedPerso.location.name
        document.getElementById('last-see').textContent = nomeEp
        document.getElementById('specie').textContent = `${foundedPerso.status} - ${foundedPerso.species}` 
    } catch (error) {
        console.log(error);
    }

}

async function statusClass(status) {
    let statusClass = status

            switch (statusClass) {
                case 'alive':
                    statusClass = 'status-alive'
                    break

                case 'dead':
                    statusClass = 'status-dead'
                    break

                default:
                    statusClass = 'status'
                    break;
            }
            return statusClass

}

page()
statusGeneral()
pickCharacter()