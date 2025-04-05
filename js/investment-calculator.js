/**
 * FinanceWise Expert - Investment Calculator
 * JavaScript functionality for investment calculator
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get input elements
    const initialInvestmentInput = document.getElementById('initial-investment');
    const initialInvestmentRange = document.getElementById('initial-investment-range');
    const monthlyContributionInput = document.getElementById('monthly-contribution');
    const monthlyContributionRange = document.getElementById('monthly-contribution-range');
    const timePeriodInput = document.getElementById('time-period');
    const timePeriodRange = document.getElementById('time-period-range');
    const expectedReturnInput = document.getElementById('expected-return');
    const expectedReturnRange = document.getElementById('expected-return-range');
    const compoundFrequencySelect = document.getElementById('compound-frequency');
    const inflationRateInput = document.getElementById('inflation-rate');
    const inflationRateRange = document.getElementById('inflation-rate-range');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Result elements
    const futureValueNominalElement = document.getElementById('future-value-nominal');
    const futureValueRealElement = document.getElementById('future-value-real');
    const totalContributionsElement = document.getElementById('total-contributions');
    const totalInterestElement = document.getElementById('total-interest');
    const resultsTableBody = document.querySelector('#results-table tbody');
    
    // Chart elements
    const chartCanvas = document.getElementById('investment-chart');
    const toggleNominalBtn = document.getElementById('toggle-nominal');
    const toggleRealBtn = document.getElementById('toggle-real');
    
    // Set default date to today
    const today = new Date();
    
    // Sync range inputs with number inputs
    if (initialInvestmentInput && initialInvestmentRange) {
        initialInvestmentInput.addEventListener('input', function() {
            initialInvestmentRange.value = this.value;
            calculateInvestment();
        });
        
        initialInvestmentRange.addEventListener('input', function() {
            initialInvestmentInput.value = this.value;
            calculateInvestment();
        });
    }
    
    if (monthlyContributionInput && monthlyContributionRange) {
        monthlyContributionInput.addEventListener('input', function() {
            monthlyContributionRange.value = this.value;
            calculateInvestment();
        });
        
        monthlyContributionRange.addEventListener('input', function() {
            monthlyContributionInput.value = this.value;
            calculateInvestment();
        });
    }
    
    if (timePeriodInput && timePeriodRange) {
        timePeriodInput.addEventListener('input', function() {
            timePeriodRange.value = this.value;
            calculateInvestment();
        });
        
        timePeriodRange.addEventListener('input', function() {
            timePeriodInput.value = this.value;
            calculateInvestment();
        });
    }
    
    if (expectedReturnInput && expectedReturnRange) {
        expectedReturnInput.addEventListener('input', function() {
            expectedReturnRange.value = this.value;
            calculateInvestment();
        });
        
        expectedReturnRange.addEventListener('input', function() {
            expectedReturnInput.value = this.value;
            calculateInvestment();
        });
    }
    
    if (inflationRateInput && inflationRateRange) {
        inflationRateInput.addEventListener('input', function() {
            inflationRateRange.value = this.value;
            calculateInvestment();
        });
        
        inflationRateRange.addEventListener('input', function() {
            inflationRateInput.value = this.value;
            calculateInvestment();
        });
    }
    
    // Add event listeners to inputs for real-time calculation
    if (compoundFrequencySelect) {
        compoundFrequencySelect.addEventListener('change', calculateInvestment);
    }
    
    // Initialize chart
    let investmentChart;
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        investmentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Principal',
                        data: [],
                        backgroundColor: 'rgba(0, 86, 179, 0.2)',
                        borderColor: 'rgba(0, 86, 179, 1)',
                        borderWidth: 1,
                        fill: true
                    },
                    {
                        label: 'Interest',
                        data: [],
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        borderWidth: 1,
                        fill: true
                    }
                ]
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
                                return context.dataset.label + ': $' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Toggle between nominal and real value charts
    if (toggleNominalBtn && toggleRealBtn) {
        toggleNominalBtn.addEventListener('click', function() {
            toggleNominalBtn.classList.add('active');
            toggleRealBtn.classList.remove('active');
            updateChart('nominal');
        });
        
        toggleRealBtn.addEventListener('click', function() {
            toggleRealBtn.classList.add('active');
            toggleNominalBtn.classList.remove('active');
            updateChart('real');
        });
    }
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Update chart with appropriate data
    function updateChart(mode = 'nominal') {
        if (!investmentChart) return;
        
        const initialInvestment = parseFloat(initialInvestmentInput.value);
        const monthlyContribution = parseFloat(monthlyContributionInput.value);
        const years = parseInt(timePeriodInput.value);
        const annualReturn = parseFloat(expectedReturnInput.value) / 100;
        const compoundFrequency = parseInt(compoundFrequencySelect.value);
        const inflationRate = parseFloat(inflationRateInput.value) / 100;
        
        const labels = Array.from({length: years + 1}, (_, i) => i);
        const principalData = [];
        const interestData = [];
        
        let totalPrincipal = initialInvestment;
        let currentValue = initialInvestment;
        
        principalData.push(totalPrincipal);
        interestData.push(0);
        
        for (let year = 1; year <= years; year++) {
            // Calculate annual contribution
            const annualContribution = monthlyContribution * 12;
            totalPrincipal += annualContribution;
            
            // Calculate compound interest for the year
            const ratePerPeriod = annualReturn / compoundFrequency;
            const periodsPerYear = compoundFrequency;
            
            // Compound the initial value
            let newValue = currentValue;
            
            // Apply compounding for each period within the year
            for (let period = 0; period < periodsPerYear; period++) {
                // For the first period of the year, add half the annual contribution
                // (assuming contributions are made monthly throughout the year)
                if (period === 0 && year === 1) {
                    newValue = (newValue + (annualContribution / 2)) * (1 + ratePerPeriod);
                } else {
                    newValue = newValue * (1 + ratePerPeriod);
                }
            }
            
            // Add the remaining half of the annual contribution for the rest of the year
            if (year === 1) {
                newValue += (annualContribution / 2);
            } else {
                newValue += annualContribution;
            }
            
            currentValue = newValue;
            
            const interestEarned = currentValue - totalPrincipal;
            
            // Calculate real (inflation-adjusted) values if needed
            if (mode === 'real') {
                const realValue = currentValue / Math.pow(1 + inflationRate, year);
                const realPrincipal = totalPrincipal;
                const realInterest = realValue - realPrincipal;
                
                principalData.push(realPrincipal);
                interestData.push(realInterest);
            } else {
                principalData.push(totalPrincipal);
                interestData.push(interestEarned);
            }
        }
        
        // Update chart data
        investmentChart.data.labels = labels;
        investmentChart.data.datasets[0].data = principalData;
        investmentChart.data.datasets[1].data = interestData;
        
        if (mode === 'real') {
            investmentChart.data.datasets[0].label = 'Principal (Inflation Adjusted)';
            investmentChart.data.datasets[1].label = 'Interest (Inflation Adjusted)';
            investmentChart.options.scales.y.title.text = 'Value (Inflation Adjusted $)';
        } else {
            investmentChart.data.datasets[0].label = 'Principal';
            investmentChart.data.datasets[1].label = 'Interest';
            investmentChart.options.scales.y.title.text = 'Value ($)';
        }
        
        investmentChart.update();
    }
    
    // Calculate investment
    function calculateInvestment() {
        // Get input values
        const initialInvestment = parseFloat(initialInvestmentInput.value);
        const monthlyContribution = parseFloat(monthlyContributionInput.value);
        const years = parseInt(timePeriodInput.value);
        const annualReturn = parseFloat(expectedReturnInput.value) / 100;
        const compoundFrequency = parseInt(compoundFrequencySelect.value);
        const inflationRate = parseFloat(inflationRateInput.value) / 100;
        
        // Calculate compound interest
        const periodsPerYear = compoundFrequency;
        const totalPeriods = years * periodsPerYear;
        const ratePerPeriod = annualReturn / periodsPerYear;
        
        // Calculate future value with regular contributions
        let futureValue = initialInvestment;
        const annualContribution = monthlyContribution * 12;
        
        // Data for results table
        const yearlyData = [];
        let totalContributions = initialInvestment;
        
        // Initialize first year data
        yearlyData.push({
            year: 0,
            contributions: initialInvestment,
            interestEarned: 0,
            balance: initialInvestment,
            realBalance: initialInvestment
        });
        
        // Calculate year by year
        for (let year = 1; year <= years; year++) {
            // Add annual contribution to total
            totalContributions += annualContribution;
            
            // Calculate compound interest for the year
            let yearStartValue = futureValue;
            
            // Apply compounding for each period within the year
            for (let period = 0; period < periodsPerYear; period++) {
                // For simplicity, we'll add contributions at the beginning of each period
                if (period === 0) {
                    futureValue = (futureValue + (annualContribution / periodsPerYear)) * (1 + ratePerPeriod);
                } else {
                    futureValue = futureValue * (1 + ratePerPeriod);
                }
            }
            
            // Calculate interest earned for the year
            const yearEndValue = futureValue;
            const interestEarned = yearEndValue - yearStartValue - annualContribution;
            
            // Calculate inflation-adjusted value
            const realBalance = yearEndValue / Math.pow(1 + inflationRate, year);
            
            // Store yearly data
            yearlyData.push({
                year: year,
                contributions: annualContribution,
                interestEarned: interestEarned,
                balance: yearEndValue,
                realBalance: realBalance
            });
        }
        
        // Calculate total interest earned
        const totalInterest = futureValue - totalContributions;
        
        // Calculate inflation-adjusted future value
        const realFutureValue = futureValue / Math.pow(1 + inflationRate, years);
        
        // Update result elements
        if (futureValueNominalElement) {
            futureValueNominalElement.textContent = formatCurrency(futureValue);
        }
        
        if (futureValueRealElement) {
            futureValueRealElement.textContent = formatCurrency(realFutureValue);
        }
        
        if (totalContributionsElement) {
            totalContributionsElement.textContent = formatCurrency(totalContributions);
        }
        
        if (totalInterestElement) {
            totalInterestElement.textContent = formatCurrency(totalInterest);
        }
        
        // Update results table
        updateResultsTable(yearlyData);
        
        // Update chart
        const activeChartMode = toggleRealBtn.classList.contains('active') ? 'real' : 'nominal';
        updateChart(activeChartMode);
    }
    
    // Update results table
    function updateResultsTable(yearlyData) {
        if (!resultsTableBody) return;
        
        // Clear existing rows
        resultsTableBody.innerHTML = '';
        
        // For a real implementation we'd show all years
        // For demo purposes, we'll show every 5 years to keep the table manageable
        const yearsToShow = yearlyData.filter(data => data.year % 5 === 0);
        
        // Always include the final year if it's not already included
        const finalYear = yearlyData[yearlyData.length - 1];
        if (finalYear.year % 5 !== 0) {
            yearsToShow.push(finalYear);
        }
        
        // Create rows for selected years
        yearsToShow.forEach(data => {
            const row = document.createElement('tr');
            
            // Create cells
            row.innerHTML = `
                <td>${data.year}</td>
                <td>${formatCurrency(data.contributions)}</td>
                <td>${formatCurrency(data.interestEarned)}</td>
                <td>${formatCurrency(data.balance)}</td>
                <td>${formatCurrency(data.realBalance)}</td>
            `;
            
            // Add row to table
            resultsTableBody.appendChild(row);
        });
        
        // Add note about showing only some years
        if (yearlyData.length > 10) {
            const noteRow = document.createElement('tr');
            noteRow.innerHTML = `
                <td colspan="5" class="table-note">
                    Showing data for every 5 years. The complete table would show all ${yearlyData.length - 1} years.
                </td>
            `;
            resultsTableBody.appendChild(noteRow);
        }
    }
    
    // Add event listener to calculate button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateInvestment);
    }
    
    // Calculate on page load
    calculateInvestment();
});
