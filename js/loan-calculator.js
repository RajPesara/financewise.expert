/**
 * FinanceWise - Loan Calculator
 * Complete JavaScript for loan calculator functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const loanAmountInput = document.getElementById('loan-amount');
    const loanAmountRange = document.getElementById('loan-amount-range');
    const interestRateInput = document.getElementById('interest-rate');
    const interestRateRange = document.getElementById('interest-rate-range');
    const loanTermSelect = document.getElementById('loan-term');
    const paymentFrequencySelect = document.getElementById('payment-frequency');
    const startDateInput = document.getElementById('start-date');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Result elements
    const monthlyPaymentElement = document.getElementById('monthly-payment');
    const totalPrincipalElement = document.getElementById('total-principal');
    const totalInterestElement = document.getElementById('total-interest');
    const totalCostElement = document.getElementById('total-cost');
    const loanTermSummaryElement = document.getElementById('loan-term-summary');
    const amortizationTableBody = document.querySelector('#amortization-table tbody');
    
    // Set default start date to today
    if (startDateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().substr(0, 10);
        startDateInput.value = formattedDate;
    }
    
    // Sync range inputs with number inputs
    if (loanAmountInput && loanAmountRange) {
        loanAmountInput.addEventListener('input', function() {
            loanAmountRange.value = this.value;
        });
        
        loanAmountRange.addEventListener('input', function() {
            loanAmountInput.value = this.value;
        });
    }
    
    if (interestRateInput && interestRateRange) {
        interestRateInput.addEventListener('input', function() {
            interestRateRange.value = this.value;
        });
        
        interestRateRange.addEventListener('input', function() {
            interestRateInput.value = this.value;
        });
    }
    
    // Initialize chart
    let paymentChart;
    const chartCanvas = document.getElementById('payment-chart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        paymentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [250000, 246984.99],
                    backgroundColor: [
                        '#0056b3',
                        '#ffc107'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Format date
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    }
    
    // Calculate loan function
    function calculateLoan() {
        // Get input values
        const loanAmount = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value) / 100;
        const loanTermYears = parseInt(loanTermSelect.value);
        const paymentsPerYear = parseInt(paymentFrequencySelect.value);
        const startDate = new Date(startDateInput.value);
        
        // Calculate payment details
        const numberOfPayments = loanTermYears * paymentsPerYear;
        const ratePerPeriod = interestRate / paymentsPerYear;
        
        // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        // Where P = payment, L = loan amount, c = rate per period, n = number of payments
        const monthlyPayment = loanAmount * 
            (ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPayments)) / 
            (Math.pow(1 + ratePerPeriod, numberOfPayments) - 1);
        
        // Calculate total cost and interest
        const totalCost = monthlyPayment * numberOfPayments;
        const totalInterest = totalCost - loanAmount;
        
        // Update results
        if (monthlyPaymentElement) {
            monthlyPaymentElement.textContent = formatCurrency(monthlyPayment);
        }
        
        if (totalPrincipalElement) {
            totalPrincipalElement.textContent = formatCurrency(loanAmount);
        }
        
        if (totalInterestElement) {
            totalInterestElement.textContent = formatCurrency(totalInterest);
        }
        
        if (totalCostElement) {
            totalCostElement.textContent = formatCurrency(totalCost);
        }
        
        // Update chart
        if (paymentChart) {
            paymentChart.data.datasets[0].data = [loanAmount, totalInterest];
            paymentChart.update();
        }
        
        // Generate loan term summary
        if (loanTermSummaryElement) {
            const endDate = new Date(startDate);
            
            // Calculate payoff date
            if (paymentsPerYear === 12) { // Monthly
                endDate.setFullYear(endDate.getFullYear() + loanTermYears);
            } else if (paymentsPerYear === 26) { // Bi-weekly
                endDate.setDate(endDate.getDate() + (loanTermYears * 26 * 14));
            } else if (paymentsPerYear === 52) { // Weekly
                endDate.setDate(endDate.getDate() + (loanTermYears * 52 * 7));
            }
            
            const endDateString = endDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            
            loanTermSummaryElement.innerHTML = `
                <p>Your loan will be paid off on <strong>${endDateString}</strong>.</p>
                <p>You will make <strong>${numberOfPayments}</strong> payments in total.</p>
            `;
        }
        
        // Generate amortization table
        generateAmortizationTable(loanAmount, interestRate, loanTermYears, paymentsPerYear, startDate, monthlyPayment);
    }
    
    // Generate amortization table
    function generateAmortizationTable(loanAmount, annualRate, years, paymentsPerYear, startDate, paymentAmount) {
        if (!amortizationTableBody) return;
        
        // Clear existing table rows
        amortizationTableBody.innerHTML = '';
        
        // Calculate period details
        const ratePerPeriod = annualRate / paymentsPerYear;
        const totalPayments = years * paymentsPerYear;
        let currentBalance = loanAmount;
        let paymentDate = new Date(startDate);
        
        // Calculate period based on payment frequency
        let periodDays = 30; // Monthly default
        if (paymentsPerYear === 26) { // Bi-weekly
            periodDays = 14;
        } else if (paymentsPerYear === 52) { // Weekly
            periodDays = 7;
        }
        
        // For a real implementation, we'd show all payments
        // For demo purposes, we'll only show first 5 payments to avoid browser performance issues
        const maxRowsToShow = 5;
        
        for (let paymentNumber = 1; paymentNumber <= maxRowsToShow; paymentNumber++) {
            // Calculate interest for this period
            const interestPayment = currentBalance * ratePerPeriod;
            
            // Calculate principal for this period
            const principalPayment = paymentAmount - interestPayment;
            
            // Update remaining balance
            currentBalance -= principalPayment;
            
            // Advance to next payment date
            paymentDate.setDate(paymentDate.getDate() + periodDays);
            
            // Create row
            const row = document.createElement('tr');
            
            // Create and append cells
            row.innerHTML = `
                <td>${paymentNumber}</td>
                <td>${formatDate(paymentDate)}</td>
                <td>${formatCurrency(paymentAmount)}</td>
                <td>${formatCurrency(principalPayment)}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(Math.max(0, currentBalance))}</td>
            `;
            
            // Add row to table
            amortizationTableBody.appendChild(row);
        }
        
        // Add note about the full table
        const noteRow = document.createElement('tr');
        noteRow.innerHTML = `
            <td colspan="6" class="table-note">
                Showing first 5 payments. In a complete implementation, all ${totalPayments} payments would be displayed.
            </td>
        `;
        amortizationTableBody.appendChild(noteRow);
    }
    
    // Add event listeners to inputs for real-time calculation
    const inputs = [loanAmountInput, loanAmountRange, interestRateInput, interestRateRange, loanTermSelect, paymentFrequencySelect, startDateInput];
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateLoan);
            input.addEventListener('change', calculateLoan);
        }
    });
    
    // Add event listener to the calculate button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateLoan);
    }
    
    // Calculate on initial load
    calculateLoan();
});
