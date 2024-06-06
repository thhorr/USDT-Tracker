// src/BaseFeeChart.js
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

const RatioChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Gas Used / Gas Limit (%)',
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
            if (block.gasUsed && block.gasLimit) {
                // Calculate the ratio as a percentage
                const ratio = (parseInt(block.gasUsed, 10) / parseInt(block.gasLimit, 10)) * 100;
                return ratio;
            }
            return null;
        };

        const handleNewBlock = async (blockNumber) => {
            const ratio = await fetchBlockData(blockNumber);

            if (ratio !== null) {
                setChartData((prevData) => {
                    let newLabels = [...prevData.labels];
                    let newData = [...prevData.datasets[0].data];

                    if (!newLabels.includes(blockNumber)) {
                        newLabels.push(blockNumber);
                        newData.push(ratio);

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

    return <Bar data={chartData} />;
};

export default RatioChart;
