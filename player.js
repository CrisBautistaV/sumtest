// Configuration
const GOOGLE_FORM_ID = '1FAIpQLScBFTrBfDiUyxaOJsy-2IwVyE8V_NLaHz0DT0zWXcO2fiNrNg'; // From Form URL
const GOOGLE_SHEET_ID = '2PACX-1vSDfcfF33qSPtOPKCjsyQjCNwyAb4gIh6iSYu7gsFBI8T5Siy9BKM-UjRW2CP656pYBAbTwTGRQlq_4'; // From Sheet URL

const AUDIO_CONFIG = {
    audios: [
        {
            id: 1,
            title: "El satánico Dr. Godínez",
            autor: "Jaime Muñoz de Baena",
            clasification: "+10. Para todo público. 7 min.",
            description: "Ingenioso y con humor absurdo, en este relato el espía internacional Jaime Bondurrieta despierta atado en una pequeña oficina, frente a un villano poco convencional: el “satánico” Dr. Godínez, un burócrata calvo y regordete con un plan de dominación mundial tan original como hilarante. "+
                        "Este cuento forma parte del libro “Y sin embargo es un pañuelo” de Jaime Muñoz de Baena.",
            voices: "Omar Zermeño, Uziel Mireles, Yarib Bautista.",
            image: "Satanico Dr Godinez.png",
            file: "Satanico Dr Godinez_8D_F.mp3"
        },
        {
            id: 2,
            title: "Un rojo destello",
            autor: "Mariana Rergis",
            clasification: "+18. Incluye insinuación sexual y del consumo de tabaco. 15 min.",
            description: "Un hábito oculto – ese “destello rojo” que irrumpe en la obscuridad - se convierte en símbolo de tensión, distancia y revelación. Lo que parece un detalle mínimo termina exhibiendo las grietas emocionales de una relación, evidenciando que la convivencia no siempre implica el conocimiento profundo del otro. "+ 
                        "La canción que suena es 'Vértigo' de La Pingo's Orquesta con voz y letra de Gabriela Bernal. "+
                        "Este cuento forma parte del libro “La noche de los crueles” de Mariana Rergis.",
            voices: "Mauren Garza, Tico Bautista, Yarib Bautista, Sakay Cruz.",            
            image: "Rojo destello.png",
            file: "Un rojo destello_8D_F.mp3"
        },
        {
            id: 3,
            title: "Dios no hizo el paro",
            autor: "Dahlia de la Cerda",
            clasification: "+18. Incluye lenguaje altisonante e insinuación del consumo de drogas. 12 min.",
            description: "Con un lenguaje directo y crudo, una joven que crece en un entorno marcado por la violencia, la precariedad económica y la desigualdad social, narra cómo la idea de un Dios protector no parece tener lugar en una realidad donde las oportunidades son escasas. "+
                        "Este cuento forma parte del libro “Perras de reserva” de Dahlia de la Cerda y la frase principal del cuento proviene de la canción “Perra vida” del cantante Tren Lokote.",
            voices: "Gabriela Elías, Tico Bautista.",
            image: "Dios no hizo el paro.png",
            file: "Dios no hizo el paro 8D_F.mp3"
        },
        {
            id: 4,
            title: "Las vacas de Quiviquinta",
            autor: "Francisco Rojas",
            clasification: "+10. Para todo público. 13 min.",
            description: "Ambientado en el pueblo de Quiviquinta, una pareja cora con una hija pequeña, sortean su vida cotidiana marcada por la escasez de alimento, la infertilidad de las cosechas y la falta de oportunidades laborales, reflejando de forma honesta y emotiva la crudeza de la vida rural y la resiliencia de sus habitantes. "+ 
                        "Este cuento forma parte de la colección del libro “México cuenta” de Grupo SURA.",
            voices: "Gabriela Elías, Uziel Mireles, Tico Bautista, Mauren Garza, Sakay Cruz, Yarib Bautista.",
            image: "Vacas de Quiviquinta.png",
            file: "Vacas de Quiviquinta_8D_F.mp3"
        },
        {
            id: 5,
            title: "Una esperanza",
            autor: "Amado Nervo",
            clasification: "+10. Para todo público, con insinuación al uso de armas. 13 min.",
            description: "Un joven militar encarcelado y condenado a muerte tras participar en una revuelta política, desde su celda y atormentado por los recuerdos de su infancia, sus amores y la vida que una vez llevó, lucha con el miedo a la muerte y el deseo visceral de seguir viviendo pese a comprender el valor de sus ideales y el sacrificio que implican. "+ 
                        "Este cuento forma parte del libro “Cuentos misteriosos” de Amado Nervo.",
            voices: "Uziel Mireles, Omar Zermeño, Tico Bautista, Yarib Bautista.",
            image: "Una esperanza.png",
            file: "Una esperanza_8D_F.mp3"
        }
    ]
};

// State management
let currentAudioIndex = 0;
let playCounts = JSON.parse(localStorage.getItem('audioPlayCounts')) || {};
let isPlaying = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadAudioList();
    initializeAudioPlayer();
    //loadPlayCounts();
    //initializeCounters();
});

// Load audio list on the page
function loadAudioList() {
    const audioList = document.getElementById('audioList');
    audioList.innerHTML = '';
    
    AUDIO_CONFIG.audios.forEach((audio, index) => {
        const audioItem = document.createElement('div');
        audioItem.className = 'audio-item';
        audioItem.onclick = () => selectAudio(index);
        
        audioItem.innerHTML = `
            <img src="${audio.image}" alt="${audio.title}">
            <h4>${audio.title}</h4>
            <small>${audio.autor}</small>
        `;
        //<small>Plays: ${getPlayCount(audio.id)}</small>
        audioList.appendChild(audioItem);
    });
}

// Initialize audio player
function initializeAudioPlayer() {
    const audioElement = document.getElementById('audioElement');
    
    // Prevent right-click download
    audioElement.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Track progress
    audioElement.addEventListener('timeupdate', updateProgress);
    
    // Track when audio ends
    audioElement.addEventListener('ended', function() {
        isPlaying = false;
    });
    
    // Prevent keyboard shortcuts for download
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            alert('Downloading is not permitted');
        }
    });
}

// Select an audio to play
function selectAudio(index) {
    currentAudioIndex = index;
    const audio = AUDIO_CONFIG.audios[index];
    const player = document.getElementById('audioPlayer');
    
    // Update UI
    document.getElementById('audioImg').src = audio.image;
    document.getElementById('audioTitle').textContent = audio.title;
    document.getElementById('audioAutor').textContent = audio.autor;
    document.getElementById('audioClass').textContent = audio.clasification;
    document.getElementById('audioDesc').textContent = audio.description;
    document.getElementById('audioVoices').textContent = audio.voices;
    //document.getElementById('playCount').textContent = getPlayCount(audio.id);
    
    // Set audio source with additional security
    const audioElement = document.getElementById('audioElement');
    audioElement.src = audio.file;
    
    // Show player
    player.style.display = 'block';
    
    // Scroll to player
    player.scrollIntoView({ behavior: 'smooth' });
    
    // Reset progress
    document.getElementById('progress').style.width = '0%';
}

// Play audio
function playAudio() {
    const audioElement = document.getElementById('audioElement');
    const currentAudio = AUDIO_CONFIG.audios[currentAudioIndex];
    
    if (audioElement.src) {
        audioElement.play();
        isPlaying = true;
        
        // Increment play count only if starting from beginning
        if (audioElement.currentTime === 0) {
            // 1. Log to Google Forms (global tracking)
            logPlayToGoogleForms(currentAudio.id);
            // 2. Update local counter (immediate display)
            // updateLocalCounter(currentAudio.id);
            // 3. Update global counts from sheet (optional, can run in background)
            // loadGlobalCountsFromSheet();

            //incrementPlayCount(currentAudio.id);
            //document.getElementById('playCount').textContent = getPlayCount(currentAudio.id);
            // Update UI
            //updateGlobalCounts();
            // Send play data to server (if you have backend)
            //logPlayEvent(currentAudio.id);
        }
    }
}

// Pause audio
function pauseAudio() {
    const audioElement = document.getElementById('audioElement');
    audioElement.pause();
    isPlaying = false;
}

// Stop audio
function stopAudio() {
    const audioElement = document.getElementById('audioElement');
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    document.getElementById('progress').style.width = '0%';
}

// Next audio
function nextAudio() {
    currentAudioIndex = (currentAudioIndex + 1) % AUDIO_CONFIG.audios.length;
    selectAudio(currentAudioIndex);
    if (isPlaying) {
        setTimeout(playAudio, 100);
    }
}

// Previous audio
function prevAudio() {
    currentAudioIndex = currentAudioIndex === 0 ? 
        AUDIO_CONFIG.audios.length - 1 : currentAudioIndex - 1;
    selectAudio(currentAudioIndex);
    if (isPlaying) {
        setTimeout(playAudio, 100);
    }
}

// Update progress bar
function updateProgress() {
    const audioElement = document.getElementById('audioElement');
    const progress = document.getElementById('progress');
    const percentage = (audioElement.currentTime / audioElement.duration) * 100;
    progress.style.width = percentage + '%';
}

// Play count management
function getPlayCount(audioId) {
    return playCounts[audioId] || 0;
}

function incrementPlayCount(audioId) {
    if (!playCounts[audioId]) {
        playCounts[audioId] = 0;
    }
    playCounts[audioId]++;
    localStorage.setItem('audioPlayCounts', JSON.stringify(playCounts));
}

function loadPlayCounts() {
    AUDIO_CONFIG.audios.forEach(audio => {
        document.querySelector(`[onclick="selectAudio(${audio.id - 1})"] small`).textContent = 
            `Plays: ${getPlayCount(audio.id)}`;
    });
}

// Server logging function (you need to implement the backend)
// Function to log play to Google Form
function logPlayToGoogleForms(audioId) {
    const formURL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
    
    // Create hidden form submission
    const data = new FormData();
    data.append('entry.1834195468', audioId); // ID from form web inspector
    
    // Send request (doesn't open new window)
    fetch(formURL, {
        method: 'POST',
        mode: 'no-cors',
        body: data
    }).catch(error => console.log('Play logged'));
    
    // Also update local counter immediately
    //incrementPlayCount(audioId);
}

// ============================================
// FUNCTION: Update local counter (for immediate display)
// ============================================
function updateLocalCounter(audioId) {
    // Increment local count
    playCounts[audioId] = (playCounts[audioId] || 0) + 1;
    
    // Save to localStorage
    localStorage.setItem('audioPlayCounts', JSON.stringify(playCounts));
    
    // Update display for this audio
    const countElement = document.getElementById(`count-${audioId}`);
    if (countElement) {
        countElement.textContent = `Plays: ${playCounts[audioId]}`;
    }
    
    // Update main player display if this audio is selected
    const currentAudio = AUDIO_CONFIG.audios[currentAudioIndex];
    if (currentAudio && currentAudio.id === audioId) {
        document.getElementById('playCount').textContent = playCounts[audioId];
    }
}

// ============================================
// FUNCTION: Load global counts from Google Sheets
// Call this periodically to update displays
// ============================================
async function loadGlobalCountsFromSheet() {
    try {
        // Using a public JSON proxy for Google Sheets
        const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
        const sheetURL = `https://docs.google.com/spreadsheets/d/e/${GOOGLE_SHEET_ID}/pub?output=csv`;
        
        const response = await fetch(CORS_PROXY + encodeURIComponent(sheetURL));
        //const response = await fetch(sheetURL);

        if (!response.ok) {
            throw new Error('Sheet not accessible');
        }
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // Count plays
        const globalCounts = {};
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const audioId = lines[i].split(',')[0]?.replace(/"/g, '');
                if (audioId) {
                    globalCounts[audioId] = (globalCounts[audioId] || 0) + 1;
                }
            }
        }
        
        // Update displays with combined counts
        AUDIO_CONFIG.audios.forEach(audio => {
            const globalCount = globalCounts[audio.id] || 0;
            const localCount = playCounts[audio.id] || 0;
            const totalCount = globalCount + localCount;
            
            const countElement = document.getElementById(`count-${audio.id}`);
            if (countElement) {
                countElement.textContent = `Plays: ${totalCount}`;
            }
        });
        
        return globalCounts;
    } catch (error) {
        console.log('Could not load global counts, using local only');
        return {};
    }
}

function getTotalPlayCount(audioId, globalCounts = {}) {
    const local = playCounts[audioId] || 0;
    const global = globalCounts[audioId] || 0;
    return local + global;
}

function initializeCounters() {
    // Load local counts first
    AUDIO_CONFIG.audios.forEach(audio => {
        const count = playCounts[audio.id] || 0;
        const countElement = document.getElementById(`count-${audio.id}`);
        if (countElement) {
            countElement.textContent = `Plays: ${count}`;
        }
    });
    
    // Then try to load global counts
    loadGlobalCountsFromSheet();
    
    // Set up periodic refresh (every 30 seconds)
    setInterval(loadGlobalCountsFromSheet, 30000);
}

function logPlayEvent(audioId) {
    // Example using fetch API
    /*
    fetch('/api/log-play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            audioId: audioId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        })
    }).catch(error => console.error('Error logging play:', error));
    */
}

//https://docs.google.com/forms/d/e/1FAIpQLScBFTrBfDiUyxaOJsy-2IwVyE8V_NLaHz0DT0zWXcO2fiNrNg/viewform?usp=publish-editor

//https://docs.google.com/spreadsheets/d/1demavDnSThadxVvzB1tD-_JEOfAriZSw7Hb8F9OCu80/edit?resourcekey=&gid=800201363#gid=800201363

