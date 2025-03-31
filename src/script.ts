// Main TypeScript file for the home page

document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.option-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const button = this.querySelector('.btn') as HTMLButtonElement;
            if (button) {
                button.style.backgroundColor = '#d32f2f';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const button = this.querySelector('.btn') as HTMLButtonElement;
            if (button) {
                button.style.backgroundColor = '';
            }
        });
    });
});