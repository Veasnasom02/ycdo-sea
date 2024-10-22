document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentTab = 'vision';
    const charts = {};

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });

    // Function to switch tabs
    function switchTab(tabId) {
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(c => {
            c.classList.remove('active');
            c.style.opacity = '0';
        });

        const newContent = document.getElementById(tabId);
        newContent.classList.add('active');
        setTimeout(() => {
            newContent.style.opacity = '1';
        }, 50);

        // Initialize charts if needed
        if (tabId === 'goals') {
            initializeGoalsCharts();
        } else if (tabId === 'budget') {
            initializeBudgetCharts();
        }

        currentTab = tabId;
    }

    // Chart Data
    const membershipData = [
        { month: 'មករា', members: 500 },
        { month: 'កុម្ភៈ', members: 1000 },
        { month: 'មីនា', members: 1800 },
        { month: 'មេសា', members: 2500 },
        { month: 'ឧសភា', members: 3300 },
        { month: 'មិថុនា', members: 4000 },
        { month: 'កក្កដា', members: 4500 },
        { month: 'សីហា', members: 5000 }
    ];

    const budgetDistributionData = [
        { name: 'ការចំណាយដើមគ្រា', value: 40500 },
        { name: 'បុគ្គលិកជួល', value: 36000 },
        { name: 'ការផ្សព្វផ្សាយ', value: 84000 },
        { name: 'កម្មវិធីសិក្ខាសាលា', value: 54000 },
        { name: 'ការបណ្តុះបណ្តាល', value: 6000 },
        { name: 'ប្រតិបត្តិការ', value: 15000 }
    ];

    const monthlyExpensesData = [
        { month: 'មករា', amount: 16250 },
        { month: 'កុម្ភៈ', amount: 16250 },
        { month: 'មីនា', amount: 16250 },
        { month: 'មេសា', amount: 16250 },
        { month: 'ឧសភា', amount: 16250 },
        { month: 'មិថុនា', amount: 16250 }
    ];

    // Initialize Goals Charts
    function initializeGoalsCharts() {
        if (!charts.membership) {
            const container = document.getElementById('membership-chart');
            if (container && container.children.length === 0) {
                const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;

                const chart = React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
                    React.createElement(LineChart, { data: membershipData },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(XAxis, { dataKey: "month" }),
                        React.createElement(YAxis),
                        React.createElement(Tooltip),
                        React.createElement(Line, {
                            type: "monotone",
                            dataKey: "members",
                            stroke: "#3b82f6",
                            strokeWidth: 2
                        })
                    )
                );

                ReactDOM.render(chart, container);
                charts.membership = true;
            }
        }
    }

    // Initialize Budget Charts
    function initializeBudgetCharts() {
        if (!charts.budget) {
            const pieContainer = document.getElementById('budget-pie-chart');
            const barContainer = document.getElementById('monthly-expenses-chart');

            if (pieContainer && pieContainer.children.length === 0) {
                const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = Recharts;
                const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

                const pieChart = React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
                    React.createElement(PieChart, {},
                        React.createElement(Pie, {
                            data: budgetDistributionData,
                            cx: "50%",
                            cy: "50%",
                            labelLine: false,
                            outerRadius: 100,
                            fill: "#8884d8",
                            dataKey: "value",
                            label: ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`
                        }, 
                        budgetDistributionData.map((entry, index) => 
                            React.createElement(Cell, {
                                key: `cell-${index}`,
                                fill: COLORS[index % COLORS.length]
                            })
                        )),
                        React.createElement(Tooltip)
                    )
                );

                ReactDOM.render(pieChart, pieContainer);
            }

            if (barContainer && barContainer.children.length === 0) {
                const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;

                const barChart = React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
                    React.createElement(BarChart, { data: monthlyExpensesData },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(XAxis, { dataKey: "month" }),
                        React.createElement(YAxis),
                        React.createElement(Tooltip),
                        React.createElement(Bar, {
                            dataKey: "amount",
                            fill: "#8884d8"
                        })
                    )
                );

                ReactDOM.render(barChart, barContainer);
            }

            charts.budget = true;
        }
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset charts
            charts.membership = false;
            charts.budget = false;

            // Reinitialize current tab's charts
            if (currentTab === 'goals') {
                initializeGoalsCharts();
            } else if (currentTab === 'budget') {
                initializeBudgetCharts();
            }
        }, 250);
    });

    // Initialize default tab
    initializeGoalsCharts();
});
