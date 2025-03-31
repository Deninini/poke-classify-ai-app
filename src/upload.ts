// TypeScript for the upload page

interface PokemonResponse {
    success: boolean;
    pokemon?: {
        id: number;
        name: string;
        types: string[];
        image: string;
        confidence: number;
    };
    error?: string;
    code?: string;
}

document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('dropArea') as HTMLDivElement;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const previewContainer = document.getElementById('previewContainer') as HTMLDivElement;
    const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
    const removeButton = document.getElementById('removeImage') as HTMLButtonElement;
    const identifyButton = document.getElementById('identifyBtn') as HTMLButtonElement;
    const resultContainer = document.getElementById('resultContainer') as HTMLDivElement;
    const resultContent = document.getElementById('resultContent') as HTMLDivElement;
    const uploadInstructions = document.querySelector('.upload-instructions') as HTMLDivElement;
    
    // Type guard for DragEvent
    function isDragEvent(event: Event): event is DragEvent {
        return 'dataTransfer' in event;
    }
    
    // Prevent default behavior for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight(): void {
        dropArea.classList.add('active');
    }
    
    function unhighlight(): void {
        dropArea.classList.remove('active');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e: Event): void {
        if (isDragEvent(e) && e.dataTransfer) {
            const files = e.dataTransfer.files;
            
            if (files.length) {
                handleFiles(files);
            }
        }
    }
    
    // Handle file input change
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length) {
            handleFiles(this.files);
        }
    });
    
    function handleFiles(files: FileList): void {
        const file = files[0];
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e: ProgressEvent<FileReader>) {
            if (e.target && e.target.result) {
                // Show preview
                imagePreview.src = e.target.result as string;
                uploadInstructions.hidden = true;
                previewContainer.hidden = false;
                identifyButton.disabled = false;
            }
        };
        
        reader.readAsDataURL(file);
    }
    
    // Remove image
    removeButton.addEventListener('click', function() {
        imagePreview.src = '';
        fileInput.value = '';
        uploadInstructions.hidden = false;
        previewContainer.hidden = true;
        identifyButton.disabled = true;
        resultContainer.hidden = true;
    });
    
    // Identify Pokémon
    identifyButton.addEventListener('click', function() {
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select an image file.');
            return;
        }
        
        // Show loading state
        this.disabled = true;
        this.textContent = 'Identifying...';
        
        // Create a FormData object
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        
        // Make API request
        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json() as Promise<PokemonResponse>;
        })
        .then(data => {
            // Display result
            displayResult(data);
        })
        .catch(error => {
            console.error('Error:', error);
            resultContent.innerHTML = `
                <div class="error-message">
                    <p>Error identifying Pokémon. Please try again.</p>
                </div>
            `;
        })
        .finally(() => {
            // Reset button state
            identifyButton.disabled = false;
            identifyButton.textContent = 'Identify Pokémon';
            resultContainer.hidden = false;
        });
    });
    
    function displayResult(data: PokemonResponse): void {
        if (data.success && data.pokemon) {
            const pokemon = data.pokemon;
            
            // Create type badges HTML
            const typeHTML = pokemon.types.map(type => 
                `<span class="type-badge" style="background-color: ${getTypeColor(type)}">${type}</span>`
            ).join('');
            
            resultContent.innerHTML = `
                <div class="pokemon-card">
                    <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image">
                    <h3>${pokemon.name}</h3>
                    <div class="pokemon-info">
                        <p><strong>Pokédex #:</strong> ${pokemon.id}</p>
                        <p><strong>Types:</strong></p>
                        <div class="pokemon-types">
                            ${typeHTML}
                        </div>
                        <p><strong>Confidence:</strong> ${(pokemon.confidence * 100).toFixed(1)}%</p>
                    </div>
                </div>
            `;
        } else {
            resultContent.innerHTML = `
                <div class="error-message">
                    <p>${data.error || 'Unable to identify Pokémon. Please try another image.'}</p>
                </div>
            `;
        }
    }
    
    // Helper function to get color for Pokémon type
    function getTypeColor(type: string): string {
        const typeColors: Record<string, string> = {
            'Normal': '#A8A878',
            'Fire': '#F08030',
            'Water': '#6890F0',
            'Electric': '#F8D030',
            'Grass': '#78C850',
            'Ice': '#98D8D8',
            'Fighting': '#C03028',
            'Poison': '#A040A0',
            'Ground': '#E0C068',
            'Flying': '#A890F0',
            'Psychic': '#F85888',
            'Bug': '#A8B820',
            'Rock': '#B8A038',
            'Ghost': '#705898',
            'Dragon': '#7038F8',
            'Dark': '#705848',
            'Steel': '#B8B8D0',
            'Fairy': '#EE99AC'
        };
        
        return typeColors[type] || '#888888';
    }
});