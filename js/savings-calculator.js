/**
 * FinanceWise Expert - Savings Calculator
 * JavaScript functionality for savings calculator
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Get input elements for Regular Savings tab
    const initialDepositInput = document.getElementById('initial-deposit');
    const initialDepositRange = document.getElementById('initial-deposit-range');
    const monthlyContributionInput = document.getElementById('monthly-contribution');
    const monthlyContributionRange = document.getElementById('monthly-contribution-range');
    const interestRateInput = document.getElementById('interest-rate');
    const interestRateRange = document.getElementById('interest-rate-range');
    const timePeriodInput = document.getElementById('time-period');
    const timePeriodRange = document.getElementById('time-period-range');
    const compoundFrequencySelect = document.getElementById('compound-frequency');
    
    // Get input elements for Lump Sum tab
    const lumpSumAmountInput = document.getElementById('lump-sum-amount');
    const lumpSumAmountRange = document.getElementById('lump-sum-amount-range');
    const lumpSumInterestRateInput = document.getElementById('lump-sum-interest-rate');
    const lumpSumInterestRateRange = document.getElementById('lump-sum-interest-rate-range');
    const lumpSumTimePeriodInput = document.getElementById('lump-sum-time-period');
    const lumpSumTimePeriodRange = document.getElementById('lump-sum-time-period-range');
    const lumpSumCompoundFrequencySelect = document.getElementById('lump-sum-compound-frequency');
    
    // Get input elements for Savings Goal tab
    const savingsGoalAmountInput = document.getElementById('savings-goal-amount');
    const savingsGoalAmountRange = document.getElementById('savings-goal-amount-range');
    const savingsGoalInitialInput = document.getElementById('savings-goal-initial');
    const savingsGoalInitialRange = document.getElementById('savings-goal-initial-range');
    const savingsGoalInterestRateInput = document.getElementById('savings-goal-interest-rate');
    const savingsGoalInterestRateRange = document.getElementById('savings-goal-interest-rate-range');
    const savingsGoalTimeInput = document.getElementById('savings-goal-time');
    const savingsGoalTimeRange = document.getElementById('savings-goal-time-range');
    const savingsGoalCompoundFrequencySelect = document.getElementById('savings-goal-compound-frequency');
    
    // Get result elements
    const finalBalanceElement = document.getElementById('final-balance');
    const totalDepositsElement = document.getElementById('total-deposits');
    const totalInterestElement = document.getElementById('total-interest');
    const requiredContributionElement = document.getElementById('required-contribution');
    const progressBarElement = document.getElementById('progress-bar');
    const progressPercentageElement = document.getElementById('progress-percentage');
    const goalSectionElement = document.getElementById('goal-section');
    const resultsTableBody = document.querySelector('#results-table tbody');
    
    // Get button elements
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Initialize variables to track current tab
    let currentTab = 'regular-savings';
    
    // Handle tab switching
    if (tabButtons.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab panel
                const tabId = this.dataset.tab;
                tabPanels.forEach(panel => panel.classList.remove('active'));
                document.getElementById(`${tabId}-panel`).classList.add('active');
                
                // Update current tab
                currentTab = tabId;
                
                // Update goal section visibility
                goalSectionElement.style.display = (currentTab === 'savings-goal') ? 'block' : 'none';
                
                // Recalculate based on the new tab
                calculateSavings();
            });
        });
    }
    
    // Sync range inputs with number inputs for Regular Savings tab
    syncRangeInput(initialDepositInput, initialDepositRange);
    syncRangeInput(monthlyContributionInput, monthlyContributionRange);
    syncRangeInput(interestRateInput, interestRateRange);
    syncRangeInput(timePeriodInput, timePeriodRange);
    
    // Sync range inputs with number inputs for Lump Sum tab
    syncRangeInput(lumpSumAmountInput, lumpSumAmountRange);
    syncRangeInput(lumpSumInterestRateInput, lumpSumInterestRateRange);
    syncRangeInput(lumpSumTimePeriodInput, lumpSumTimePeriodRange);
    
    // Sync range inputs with number inputs for Savings Goal tab
    syncRangeInput(savingsGoalAmountInput, savingsGoalAmountRange);
    syncRangeInput(savingsGoalInitialInput, savingsGoalInitialRange);
    syncRangeInput(savingsGoalInterestRateInput, savingsGoalInterestRateRange);
    syncRangeInput(savingsGoalTimeInput, savingsGoalTimeRange);
    
    // Function to sync number input with range input
    function syncRangeInput(numberInput, rangeInput) {
        if (numberInput && rangeInput) {
            numberInput.addEventListener('input', function() {
                rangeInput.value = this.value;
                calculateSavings();
            });
            
            rangeInput.addEventListener('input', function() {
                numberInput.value = this.value;
                calculateSavings();
            });
        }
    }
    
    // Initialize chart
    let savingsChart;
    const chartCanvas = document.getElementById('savings-chart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Balance',
                        data: [],
                        borderColor: '#0056b3',
                        backgroundColor: 'rgba(0, 86, 179, 0.1)',
                        fill: true,
                        tension: 0.1
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
                                return 'Balance: $' + context.raw.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
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
                            text: 'Balance ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                });
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Calculate savings based on current tab
    function calculateSavings() {
        switch (currentTab) {
            case 'regular-savings':
                calculateRegularSavings();
                break;
            case 'lump-sum':
                calculateLumpSum();
                break;
            case 'savings-goal':
                calculateSavingsGoal();
                break;
        }
    }
    
    // Calculate regular savings
    function calculateRegularSavings() {
        // Get input values
        const initialDeposit = parseFloat(initialDepositInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const interestRate = parseFloat(interestRateInput.value) / 100;
        const years = parseInt(timePeriodInput.value) || 0;
        const compoundFrequency = parseInt(compoundFrequencySelect.value) || 12;
        
        // Calculate savings growth
        const { finalBalance, totalDeposits, yearlyData } = calculateSavingsGrowth(
            initialDeposit,
            monthlyContribution,
            interestRate,
            years,
            compoundFrequency
        );
        
        // Update result elements
        updateResults(finalBalance, totalDeposits, yearlyData);
    }
    
    // Calculate lump sum
    function calculateLumpSum() {
        // Get input values
        const lumpSumAmount = parseFloat(lumpSumAmountInput.value) || 0;
        const interestRate = parseFloat(lumpSumInterestRateInput.value) / 100;
        const years = parseInt(lumpSumTimePeriodInput.value) || 0;
        const compoundFrequency = parseInt(lumpSumCompoundFrequencySelect.value) || 12;
        
        // Calculate savings growth (no monthly contribution)
        const { finalBalance, totalDeposits, yearlyData } = calculateSavingsGrowth(
            lumpSumAmount,
            0, // No monthly contribution
            interestRate,
            years,
            compoundFrequency
        );
        
        // Update result elements
        updateResults(finalBalance, totalDeposits, yearlyData);
    }
    
    // Calculate savings goal
    function calculateSavingsGoal() {
        // Get input values
        const goalAmount = parseFloat(savingsGoalAmountInput.value) || 0;
        const initialDeposit = parseFloat(savingsGoalInitialInput.value) || 0;
        const interestRate = parseFloat(savingsGoalInterestRateInput.value) / 100;
        const years = parseInt(savingsGoalTimeInput.value) || 0;
        const compoundFrequency = parseInt(savingsGoalCompoundFrequencySelect.value) || 12;
        
        // Calculate required monthly contribution
        const requiredContribution = calculateRequiredContribution(
            goalAmount,
            initialDeposit,
            interestRate,
            years,
            compoundFrequency
        );
        
        // Calculate savings growth with required contribution
        const { finalBalance, totalDeposits, yearlyData } = calculateSavingsGrowth(
            initialDeposit,
            requiredContribution,
            interestRate,
            years,
            compoundFrequency
        );
        
        // Update result elements
        updateResults(finalBalance, totalDeposits, yearlyData);
        
        // Update goal-specific elements
        if (requiredContributionElement) {
            requiredContributionElement.textContent = formatCurrency(requiredContribution);
        }
        
        // Update progress bar if initial deposit is set
        if (progressBarElement && progressPercentageElement) {
            const progressPercentage = Math.min(100, (initialDeposit / goalAmount) * 100);
            progressBarElement.style.width = progressPercentage + '%';
            progressPercentageElement.textContent = progressPercentage.toFixed(1) + '%';
        }
    }
    
    // Calculate required monthly contribution to reach a goal
    function calculateRequiredContribution(goalAmount, initialDeposit, interestRate, years, compoundFrequency) {
        // P = (FV - PV * (1 + r/n)^nt) / (((1 + r/n)^nt - 1) / (r/n))
        // Where:
        // P = Monthly contribution
        // FV = Future value (goal amount)
        // PV = Present value (initial deposit)
        // r = Annual interest rate (decimal)
        // n = Compound frequency
        // t = Time in years
        
        const n = compoundFrequency;
        const t = years;
        const r = interestRate;
        const FV = goalAmount;
        const PV = initialDeposit;
        
        // Calculate (1 + r/n)^nt
        const compoundFactor = Math.pow(1 + r / n, n * t);
        
        // Calculate numerator: FV - PV * (1 + r/n)^nt
        const numerator = FV - PV * compoundFactor;
        
        // Calculate denominator: ((1 + r/n)^nt - 1) / (r/n)
        const denominator = (compoundFactor - 1) / (r / n);
        
        // If interest rate is 0 or extremely low
        if (r < 0.0001) {
            return (goalAmount - initialDeposit) / (years * 12);
        }
        
        // Calculate required monthly contribution (adjusted for monthly payments)
        return numerator / denominator / (12 / n);
    }
    
    // Calculate savings growth
    function calculateSavingsGrowth(initialDeposit, monthlyContribution, interestRate, years, compoundFrequency) {
        // Periods per year
        const periodsPerYear = compoundFrequency;
        
        // Rate per period
        const ratePerPeriod = interestRate / periodsPerYear;
        
        // Contribution per period
        const contributionPerPeriod = monthlyContribution * 12 / periodsPerYear;
        
        // Initialize variables
        let balance = initialDeposit;
        let totalDeposits = initialDeposit;
        let totalInterest = 0;
        
        // Data for each year
        const yearlyData = [];
        
        // Store initial values
        yearlyData.push({
            year: 0,
            deposits: initialDeposit,
            interest: 0,
            balance: initialDeposit
        });
        
        // Calculate growth for each year
        for (let year = 1; year <= years; year++) {
            let startYearBalance = balance;
            let yearDeposits = 0;
            let yearInterest = 0;
            
            // Calculate for each period in the year
            for (let period = 1; period <= periodsPerYear; period++) {
                // Add contribution for this period
                balance += contributionPerPeriod;
                yearDeposits += contributionPerPeriod;
                
                // Calculate interest for this period
                const periodInterest = balance * ratePerPeriod;
                balance += periodInterest;
                yearInterest += periodInterest;
            }
            
            // Update totals
            totalDeposits += yearDeposits;
            totalInterest += yearInterest;
            
            // Store yearly data
            yearlyData.push({
                year: year,
                deposits: yearDeposits,
                interest: yearInterest,
                balance: balance
            });
        }
        
        // Return final values
        return {
            finalBalance: balance,
            totalDeposits: totalDeposits,
            totalInterest: totalInterest,
            yearlyData: yearlyData
        };
    }
    
    // Update results
    function updateResults(finalBalance, totalDeposits, yearlyData) {
        // Update result elements
        if (finalBalanceElement) {
            finalBalanceElement.textContent = formatCurrency(finalBalance);
        }
        
        if (totalDepositsElement) {
            totalDepositsElement.textContent = formatCurrency(totalDeposits);
        }
        
        if (totalInterestElement) {
            totalInterestElement.textContent = formatCurrency(finalBalance - totalDeposits);
        }
        
        // Update chart
        updateChart(yearlyData);
        
        // Update results table
        updateResultsTable(yearlyData);
    }
    
    // Update chart
    function updateChart(yearlyData) {
        if (!savingsChart) return;
        
        // Extract years and balances from yearly data
        const labels = yearlyData.map(data => data.year);
        const balances = yearlyData.map(data => data.balance);
        
        // Update chart data
        savingsChart.data.labels = labels;
        savingsChart.data.datasets[0].data = balances;
        
        // Update chart
        savingsChart.update();
    }
    
    // Update results table
    function updateResultsTable(yearlyData) {
        if (!resultsTableBody) return;
        
        // Clear existing rows
        resultsTableBody.innerHTML = '';
        
        // Create rows for all years
        yearlyData.forEach(data => {
            const row = document.createElement('tr');
            
            // Create cells
            row.innerHTML = `
                <td>${data.year}</td>
                <td>${formatCurrency(data.deposits)}</td>
                <td>${formatCurrency(data.interest)}</td>
                <td>${formatCurrency(data.balance)}</td>
            `;
            
            // Add row to table
            resultsTableBody.appendChild(row);
        });
    }
    
    // Add event listener to calculate button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSavings);
    }
    
    // Add event listeners to inputs for real-time calculation
    document.querySelectorAll('.input-group input, .input-group select').forEach(input => {
        input.addEventListener('change', calculateSavings);
    });
    
    // Calculate on page load
    calculateSavings();
});
