// src/BaseFeeChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Alchemy, Network } from 'alchemy-sdk';
import 'chart.js/auto';

// Alchemy SDK configuration
const config = {
    apiKey: 'm--SkA-VnUg9hBpYJiF3jYKy2Lraby5V', // Replace with your API key
    network: Network.ETH_MAINNET, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

const BaseFeeChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Base Fee Per Gas',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color for the area
                borderWidth: 1,
                fill: true, // Enable fill to create an area chart
            },
        ],
    });

    useEffect(() => {
        const fetchBlockData = async (blockNumber) => {
            const block = await alchemy.core.getBlock(blockNumber);
            return block.baseFeePerGas ? parseInt(block.baseFeePerGas, 10) : null;
        };

        const handleNewBlock = async (blockNumber) => {
            const baseFeePerGas = await fetchBlockData(blockNumber);

            if (baseFeePerGas !== null) {
                setChartData((prevData) => {
                    let newLabels = [...prevData.labels];
                    let newData = [...prevData.datasets[0].data];

                    if (!newLabels.includes(blockNumber)) {
                        newLabels.push(blockNumber);
                        newData.push(baseFeePerGas);

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
            }
        };

        alchemy.ws.on("block", handleNewBlock);

        return () => {
            alchemy.ws.off("block", handleNewBlock);
        };
    }, []);

    return <Line data={chartData} />;
};

export default BaseFeeChart;
