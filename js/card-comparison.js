/**
 * FinanceWise Expert - Credit Card Comparison Tool
 * JavaScript functionality for credit card comparison
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get filter elements
    const cardTypeSelect = document.getElementById('card-type');
    const creditScoreSelect = document.getElementById('credit-score');
    const annualFeeSelect = document.getElementById('annual-fee');
    const rewardsTypeSelect = document.getElementById('rewards-type');
    
    // Get spending input elements
    const diningSpendingInput = document.getElementById('dining-spending');
    const groceriesSpendingInput = document.getElementById('groceries-spending');
    const gasSpendingInput = document.getElementById('gas-spending');
    const travelSpendingInput = document.getElementById('travel-spending');
    const otherSpendingInput = document.getElementById('other-spending');
    
    // Get button elements
    const resetFiltersBtn = document.getElementById('reset-filters');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const compareSelectedBtn = document.getElementById('compare-selected');
    const closeComparisonBtn = document.getElementById('close-comparison');
    
    // Get container elements
    const cardsGrid = document.getElementById('cards-grid');
    const resultsCount = document.getElementById('results-count');
    const comparisonSection = document.getElementById('comparison-section');
    const comparisonTable = document.getElementById('comparison-table');
    
    // Card data
    const cardData = {
        'premium-rewards': {
            name: 'Premium Rewards Plus Card',
            issuer: 'National Bank',
            annualFee: '$95',
            rewards: '3x points on dining, 2x on travel, 1x on everything else',
            welcomeBonus: '60,000 bonus points after spending $4,000 in first 3 months',
            regularAPR: '16.99% - 23.99% Variable',
            introAPR: '0% for 12 months on purchases',
            foreignFee: 'None',
            creditScore: 'Excellent (750+)',
            benefits: [
                'Annual $300 travel credit',
                'Priority boarding and lounge access',
                'Trip cancellation/interruption insurance',
                'Cell phone protection'
            ],
            type: 'travel',
            rewardsType: 'points'
        },
        'cash-back-freedom': {
            name: 'Cash Back Freedom Card',
            issuer: 'City Credit',
            annualFee: '$0',
            rewards: '5% cash back on rotating categories (up to $1,500 quarterly), 1% on all other purchases',
            welcomeBonus: '$200 cash back after spending $500 in first 3 months',
            regularAPR: '15.99% - 24.74% Variable',
            introAPR: '0% for 15 months on purchases and balance transfers',
            foreignFee: '3%',
            creditScore: 'Good (700-749)',
            benefits: [
                'No annual fee',
                'Free credit score access',
                'Purchase protection',
                'Extended warranty protection'
            ],
            type: 'cash-back',
            rewardsType: 'cash-back'
        },
        'global-explorer': {
            name: 'Global Explorer Card',
            issuer: 'World Bank',
            annualFee: '$550',
            rewards: '5x points on flights, 3x on restaurants and hotels, 1x on everything else',
            welcomeBonus: '75,000 points after spending $5,000 in first 3 months',
            regularAPR: '18.99% - 25.99% Variable',
            introAPR: 'None',
            foreignFee: 'None',
            creditScore: 'Excellent (750+)',
            benefits: [
                'Airport lounge access worldwide',
                'Global Entry or TSA PreCheck credit',
                'Annual $300 travel credit',
                'Trip delay and cancellation insurance',
                'Lost luggage reimbursement'
            ],
            type: 'travel',
            rewardsType: 'points'
        },
        'balance-transfer-pro': {
            name: 'Balance Transfer Pro Card',
            issuer: 'Union Finance',
            annualFee: '$0',
            rewards: '1.5% cash back on all purchases',
            welcomeBonus: 'None',
            regularAPR: '14.99% - 24.99% Variable',
            introAPR: '0% for 21 months on balance transfers',
            foreignFee: '3%',
            creditScore: 'Good (700-749)',
            benefits: [
                'No annual fee',
                'Free credit score monitoring',
                'Identity theft protection',
                'Zero liability protection'
            ],
            type: 'balance-transfer',
            rewardsType: 'cash-back'
        },
        'business-rewards': {
            name: 'Business Rewards Card',
            issuer: 'Commerce Bank',
            annualFee: '$95 (waived first year)',
            rewards: '3x points on office supplies, 2x on internet/phone, 1x on everything else',
            welcomeBonus: '50,000 points after spending $5,000 in first 3 months',
            regularAPR: '15.99% - 21.99% Variable',
            introAPR: '0% for 12 months on purchases',
            foreignFee: 'None',
            creditScore: 'Good (700-749)',
            benefits: [
                'Expense tracking and management tools',
                'Employee cards with spending limits',
                'Year-end summary reports',
                'Travel and emergency assistance'
            ],
            type: 'business',
            rewardsType: 'points'
        },
        'secured-credit-builder': {
            name: 'Secured Credit Builder Card',
            issuer: 'Community Trust',
            annualFee: '$0',
            rewards: '1% cash back on all purchases',
            welcomeBonus: 'None',
            regularAPR: '24.99% Variable',
            introAPR: 'None',
            foreignFee: '3%',
            creditScore: 'Poor (600-649)',
            benefits: [
                'Security deposit as low as $200',
                'Automatic credit line reviews after 6 months',
                'Free credit score and credit building tools',
                'Path to unsecured credit'
            ],
            type: 'secured',
            rewardsType: 'cash-back'
        }
    };
    
    // Track selected cards for comparison
    let selectedCards = [];
    const maxCompare = 3;
    
    // Initialize the page
    function init() {
        // Add event listeners to comparison checkboxes
        const checkboxes = document.querySelectorAll('.compare-checkbox input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleCompareCheckbox);
        });
        
        // Add event listeners to filter buttons
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', resetFilters);
        }
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyFilters);
        }
        
        if (compareSelectedBtn) {
            compareSelectedBtn.addEventListener('click', showComparison);
        }
        
        if (closeComparisonBtn) {
            closeComparisonBtn.addEventListener('click', hideComparison);
        }
        
        // Calculate initial rewards values
        calculateRewardValues();
    }
    
    // Handle compare checkbox changes
    function handleCompareCheckbox(event) {
        const cardId = event.target.dataset.cardId;
        
        if (event.target.checked) {
            // Add card to selected list if not already at max
            if (selectedCards.length < maxCompare) {
                selectedCards.push(cardId);
            } else {
                // Uncheck the checkbox if already at max
                event.target.checked = false;
                alert(`You can compare up to ${maxCompare} cards at a time.`);
            }
        } else {
            // Remove card from selected list
            selectedCards = selectedCards.filter(id => id !== cardId);
        }
        
        // Update compare button state
        updateCompareButton();
    }
    
    // Update compare button state
    function updateCompareButton() {
        if (compareSelectedBtn) {
            if (selectedCards.length >= 2) {
                compareSelectedBtn.disabled = false;
            } else {
                compareSelectedBtn.disabled = true;
            }
        }
    }
    
    // Reset filters to default values
    function resetFilters() {
        // Reset selects
        if (cardTypeSelect) cardTypeSelect.value = 'all';
        if (creditScoreSelect) creditScoreSelect.value = 'all';
        if (annualFeeSelect) annualFeeSelect.value = 'all';
        if (rewardsTypeSelect) rewardsTypeSelect.value = 'all';
        
        // Reset spending inputs
        if (diningSpendingInput) diningSpendingInput.value = 300;
        if (groceriesSpendingInput) groceriesSpendingInput.value = 500;
        if (gasSpendingInput) gasSpendingInput.value = 200;
        if (travelSpendingInput) travelSpendingInput.value = 200;
        if (otherSpendingInput) otherSpendingInput.value = 800;
        
        // Recalculate rewards
        calculateRewardValues();
        
        // Show all cards
        filterCards();
    }
    
    // Apply filters to card list
    function applyFilters() {
        filterCards();
        calculateRewardValues();
    }
    
    // Filter cards based on selected criteria
    function filterCards() {
        // Get filter values
        const cardType = cardTypeSelect ? cardTypeSelect.value : 'all';
        const creditScore = creditScoreSelect ? creditScoreSelect.value : 'all';
        const annualFee = annualFeeSelect ? annualFeeSelect.value : 'all';
        const rewardsType = rewardsTypeSelect ? rewardsTypeSelect.value : 'all';
        
        // Get all card elements
        const cardElements = document.querySelectorAll('.card-item');
        
        // Track visible cards count
        let visibleCount = 0;
        
        // Filter cards
        cardElements.forEach(card => {
            const cardId = card.dataset.cardId;
            const cardInfo = cardData[cardId];
            
            // Check if card matches filters
            let visible = true;
            
            // Filter by card type
            if (cardType !== 'all' && cardInfo.type !== cardType) {
                visible = false;
            }
            
            // Filter by credit score
            if (creditScore !== 'all') {
                // Simple contains check - in a real implementation, would have more complex logic
                if (!cardInfo.creditScore.toLowerCase().includes(creditScore.toLowerCase())) {
                    visible = false;
                }
            }
            
            // Filter by annual fee
            if (annualFee !== 'all') {
                if (annualFee === 'no-fee' && cardInfo.annualFee !== '$0') {
                    visible = false;
                } else if (annualFee === 'under-100' && 
                           (cardInfo.annualFee === '$0' || 
                            parseInt(cardInfo.annualFee.replace(/[^0-9]/g, '')) >= 100)) {
                    visible = false;
                } else if (annualFee === 'over-100' && 
                           (cardInfo.annualFee === '$0' || 
                            parseInt(cardInfo.annualFee.replace(/[^0-9]/g, '')) < 100)) {
                    visible = false;
                }
            }
            
            // Filter by rewards type
            if (rewardsType !== 'all' && cardInfo.rewardsType !== rewardsType) {
                visible = false;
            }
            
            // Show or hide the card
            if (visible) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCount} cards based on your preferences`;
        }
    }
    
    // Calculate reward values based on spending
    function calculateRewardValues() {
        // Get spending values
        const diningSpending = diningSpendingInput ? parseFloat(diningSpendingInput.value) : 300;
        const groceriesSpending = groceriesSpendingInput ? parseFloat(groceriesSpendingInput.value) : 500;
        const gasSpending = gasSpendingInput ? parseFloat(gasSpendingInput.value) : 200;
        const travelSpending = travelSpendingInput ? parseFloat(travelSpendingInput.value) : 200;
        const otherSpending = otherSpendingInput ? parseFloat(otherSpendingInput.value) : 800;
        
        // Annual spending calculations
        const annualDining = diningSpending * 12;
        const annualGroceries = groceriesSpending * 12;
        const annualGas = gasSpending * 12;
        const annualTravel = travelSpending * 12;
        const annualOther = otherSpending * 12;
        
        // Calculate rewards for each card
        Object.keys(cardData).forEach(cardId => {
            const card = cardData[cardId];
            let annualValue = 0;
            
            // This is a simplified calculation - a real implementation would be more complex
            // and would take into account quarterly rotating categories, tiered rewards, etc.
            
            // Simplified calculations based on card type
            switch (cardId) {
                case 'premium-rewards':
                    // 3x on dining, 2x on travel, 1x on everything else
                    // Assuming 1 point = 1.5 cents
                    annualValue += (annualDining * 0.03 * 1.5); // 3% on dining
                    annualValue += (annualTravel * 0.02 * 1.5); // 2% on travel
                    annualValue += ((annualGroceries + annualGas + annualOther) * 0.01 * 1.5); // 1% on everything else
                    annualValue += 300; // Annual travel credit
                    // Sign-up bonus amortized over 2 years
                    annualValue += (60000 * 0.015) / 2; // 60,000 points at 1.5 cents per point over 2 years
                    break;
                    
                case 'cash-back-freedom':
                    // 5% on rotating categories (assumed to apply to 1/4 of grocery and gas spending)
                    // 1% on everything else
                    annualValue += ((annualGroceries * 0.25 * 0.05) + (annualGroceries * 0.75 * 0.01)); // Groceries
                    annualValue += ((annualGas * 0.25 * 0.05) + (annualGas * 0.75 * 0.01)); // Gas
                    annualValue += (annualDining * 0.01); // 1% on dining
                    annualValue += (annualTravel * 0.01); // 1% on travel
                    annualValue += (annualOther * 0.01); // 1% on other
                    // Sign-up bonus amortized over 2 years
                    annualValue += 200 / 2; // $200 cash back over 2 years
                    break;
                    
                case 'global-explorer':
                    // 5x on flights, 3x on restaurants and hotels, 1x on everything else
                    // Assuming 1 point = 2 cents for premium travel redemptions
                    annualValue += (annualTravel * 0.05 * 2); // 5% on travel
                    annualValue += (annualDining * 0.03 * 2); // 3% on dining
                    annualValue += ((annualGroceries + annualGas + annualOther) * 0.01 * 2); // 1% on everything else
                    annualValue += 300; // Annual travel credit
                    annualValue += 100; // Global Entry/TSA PreCheck credit (amortized over 4 years)
                    // Lounge access valued at $300/year
                    annualValue += 300;
                    // Sign-up bonus amortized over 2 years
                    annualValue += (75000 * 0.02) / 2; // 75,000 points at 2 cents per point over 2 years
                    // Subtract annual fee
                    annualValue -= 550;
                    break;
                    
                case 'balance-transfer-pro':
                    // 1.5% on all purchases
                    annualValue += ((annualDining + annualGroceries + annualGas + annualTravel + annualOther) * 0.015);
                    // Value of 0% intro APR on $5,000 balance for 21 months
                    // (assuming 20% regular APR saved for 21 months on $5,000)
                    annualValue += (5000 * 0.20 * (21/12)) / 2; // Amortized over 2 years
                    break;
                    
                case 'business-rewards':
                    // 3x on office supplies, 2x on internet/phone, 1x on everything else
                    // Assuming 1 point = 1.2 cents
                    // Assume 10% of "other" is office supplies
                    annualValue += (annualOther * 0.1 * 0.03 * 1.2); // 3% on office supplies
                    // Assume 5% of "other" is internet/phone
                    annualValue += (annualOther * 0.05 * 0.02 * 1.2); // 2% on internet/phone
                    // Everything else at 1%
                    annualValue += ((annualDining + annualGroceries + annualGas + annualTravel + (annualOther * 0.85)) * 0.01 * 1.2);
                    // Sign-up bonus amortized over 2 years
                    annualValue += (50000 * 0.012) / 2; // 50,000 points at 1.2 cents per point over 2 years
                    // Subtract annual fee (waived first year, so half of $95 amortized over 2 years)
                    annualValue -= 95 / 2;
                    break;
                    
                case 'secured-credit-builder':
                    // 1% on all purchases
                    annualValue += ((annualDining + annualGroceries + annualGas + annualTravel + annualOther) * 0.01);
                    break;
            }
            
            // Update card display with calculated value
            const valueElement = document.querySelector(`[data-card-id="${cardId}"] .reward-value strong`);
            if (valueElement) {
                valueElement.textContent = ' + Math.round(annualValue).toLocaleString();
            }
        });
    }
    
    // Show comparison section
    function showComparison() {
        if (selectedCards.length < 2) {
            alert('Please select at least 2 cards to compare.');
            return;
        }
        
        // Build comparison table
        buildComparisonTable();
        
        // Hide cards grid, show comparison section
        if (comparisonSection) {
            comparisonSection.classList.add('active');
            // Scroll to comparison section
            comparisonSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Hide comparison section
    function hideComparison() {
        if (comparisonSection) {
            comparisonSection.classList.remove('active');
            // Scroll back to top of results
            document.querySelector('.results-container').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Build comparison table
    function buildComparisonTable() {
        if (!comparisonTable) return;
        
        // Get table header and body
        const thead = comparisonTable.querySelector('thead tr');
        const tbody = comparisonTable.querySelector('tbody');
        
        // Clear existing headers (except for the first one)
        while (thead.children.length > 1) {
            thead.removeChild(thead.lastChild);
        }
        
        // Add headers for selected cards
        selectedCards.forEach(cardId => {
            const card = cardData[cardId];
            const th = document.createElement('th');
            th.textContent = card.name;
            thead.appendChild(th);
        });
        
        // Update table rows with card data
        const rows = tbody.querySelectorAll('tr');
        
        // Annual Fee
        updateTableRow(rows[0], selectedCards, card => card.annualFee);
        
        // Rewards Structure
        updateTableRow(rows[1], selectedCards, card => card.rewards);
        
        // Welcome Bonus
        updateTableRow(rows[2], selectedCards, card => card.welcomeBonus);
        
        // Annual Value
        updateTableRow(rows[3], selectedCards, card => {
            const valueElement = document.querySelector(`[data-card-id="${card._id}"] .reward-value strong`);
            return valueElement ? valueElement.textContent : 'N/A';
        });
        
        // Regular APR
        updateTableRow(rows[4], selectedCards, card => card.regularAPR);
        
        // Intro APR
        updateTableRow(rows[5], selectedCards, card => card.introAPR || 'None');
        
        // Foreign Transaction Fee
        updateTableRow(rows[6], selectedCards, card => card.foreignFee);
        
        // Credit Score
        updateTableRow(rows[7], selectedCards, card => card.creditScore);
        
        // Additional Benefits
        updateTableRow(rows[8], selectedCards, card => {
            if (card.benefits && card.benefits.length) {
                const ul = document.createElement('ul');
                card.benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.textContent = benefit;
                    ul.appendChild(li);
                });
                return ul.outerHTML;
            }
            return 'None';
        });
    }
    
    // Update a table row with card data
    function updateTableRow(row, cardIds, dataCallback) {
        // Remove existing data cells
        while (row.children.length > 1) {
            row.removeChild(row.lastChild);
        }
        
        // Add data for each selected card
        cardIds.forEach(cardId => {
            const card = { ...cardData[cardId], _id: cardId };
            const td = document.createElement('td');
            
            // Get data for this card and feature
            const data = dataCallback(card);
            
            // For HTML content
            if (typeof data === 'string' && data.includes('<')) {
                td.innerHTML = data;
            } else {
                td.textContent = data;
            }
            
            row.appendChild(td);
        });
    }
    
    // Initialize on page load
    init();
});