// src/BlockChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Alchemy, Network } from 'alchemy-sdk';
import 'chart.js/auto';

// Alchemy SDK configuration
const config = {
    apiKey: 'm--SkA-VnUg9hBpYJiF3jYKy2Lraby5V', // Replace with your API key
    network: Network.ETH_MAINNET, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

const filter = {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
};

const UsdtChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Transaction Value',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
            },
        ],
    });

    useEffect(() => {
        let currentBlock = null;
        let totalValue = 0;

        alchemy.ws.on(filter, (log) => {
            const blockNumber = log.blockNumber;
            const value = parseInt(log.data, 16); // Convert transaction value from hex to integer

            if (currentBlock === null) {
                currentBlock = blockNumber;
            }

            if (blockNumber === currentBlock) {
                totalValue += value;
            } else {
                setChartData((prevData) => {
                    let newLabels = [...prevData.labels];
                    let newData = [...prevData.datasets[0].data];

                    if (!newLabels.includes(currentBlock)) {
                        newLabels.push(currentBlock);
                        newData.push(totalValue);

                        // Ensure only the latest 10 blocks are kept
                        if (newLabels.length > 10) {
                            newLabels.shift();
                            newData.shift();
                        }
                    }

                    return {
                        ...prevData,
                        labels: newLabels,
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: newData,
                            },
                        ],
                    };
                });

                currentBlock = blockNumber;
                totalValue = value; // Reset the total value for the new block
            }
        });

        return () => {
            alchemy.ws.removeAllListeners();
        };
    }, []);

    return <Bar data={chartData} />;
};

export default UsdtChart;
