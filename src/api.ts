// TypeScript for the API page

interface ApiResponse {
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
    const imageUrlInput = document.getElementById('imageUrlInput') as HTMLInputElement;
    const apiSubmitBtn = document.getElementById('apiSubmitBtn') as HTMLButtonElement;
    const apiResultContainer = document.getElementById('apiResultContainer') as HTMLDivElement;
    const apiResponse = document.getElementById('apiResponse') as HTMLPreElement;
    
    // Handle API test submission
    apiSubmitBtn.addEventListener('click', function() {
        const imageUrl = imageUrlInput.value.trim();
        
        if (!imageUrl) {
            alert('Please enter an image URL');
            return;
        }
        
        // Show loading state
        this.disabled = true;
        this.textContent = 'Processing...';
        
        // Make API request
        fetch('/api/identify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json() as Promise<ApiResponse>;
        })
        .then(data => {
            // Display formatted JSON response
            apiResponse.textContent = JSON.stringify(data, null, 2);
            apiResultContainer.hidden = false;
        })
        .catch(error => {
            console.error('Error:', error);
            apiResponse.textContent = JSON.stringify({
                success: false,
                error: 'Failed to connect to the API. Please try again.',
                code: 'CONNECTION_ERROR'
            } as ApiResponse, null, 2);
            apiResultContainer.hidden = false;
        })
        .finally(() => {
            // Reset button state
            apiSubmitBtn.disabled = false;
            apiSubmitBtn.textContent = 'Identify Pokémon';
        });
    });
    
    // Add syntax highlighting to code blocks
    document.querySelectorAll('pre code').forEach(block => {
        highlightSyntax(block as HTMLElement);
    });
    
    // Simple syntax highlighting function
    function highlightSyntax(element: HTMLElement): void {
        const text = element.textContent || '';
        
        // Highlight JSON keys and values
        const highlighted = text
            .replace(/"([^"]+)":/g, '<span style="color: #e06c75;">"$1"</span>:')
            .replace(/: "([^"]+)"/g, ': <span style="color: #98c379;">"$1"</span>')
            .replace(/: (true|false|null)/g, ': <span style="color: #d19a66;">$1</span>')
            .replace(/: (\d+(\.\d+)?)/g, ': <span style="color: #d19a66;">$1</span>');
        
        element.innerHTML = highlighted;
    }
});