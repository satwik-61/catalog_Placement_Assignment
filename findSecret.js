const fs = require('fs');

function decodeNumber(baseSystem, encodedValue) {
    return parseInt(encodedValue, baseSystem);
}

function calculateConstant(pointsList) {
    let constant = 0;

    for (let idx = 0; idx < pointsList.length; idx++) {
        let xCoord = pointsList[idx].x;
        let yCoord = pointsList[idx].y;

        let termProduct = yCoord;
        for (let innerIdx = 0; innerIdx < pointsList.length; innerIdx++) {
            if (idx !== innerIdx) {
                let otherXCoord = pointsList[innerIdx].x;
                termProduct *= otherXCoord / (otherXCoord - xCoord);
            }
        }

        constant += termProduct;
    }

    return Math.round(constant); 
}

function extractSecretFromJSON(filePath) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const totalPoints = jsonData.keys.n;
    const threshold = jsonData.keys.k;

    if (totalPoints < threshold) {
        throw new Error("Insufficient points to reconstruct the polynomial.");
    }

    const parsedPoints = [];

    for (const identifier in jsonData) {
        if (identifier === "keys") continue;

        const xValue = parseInt(identifier);
        const baseSystem = parseInt(jsonData[identifier].base);
        const yValue = decodeNumber(baseSystem, jsonData[identifier].value);

        parsedPoints.push({ x: xValue, y: yValue });
    }

    parsedPoints.sort((a, b) => a.x - b.x);

    const subsetPoints = parsedPoints.slice(0, threshold);
    return calculateConstant(subsetPoints);
}

try {
    const secretResult1 = extractSecretFromJSON('testcase1.json'); // First JSON file
    console.log("The constant (c) for testcase1.json is:", secretResult1);

    const secretResult2 = extractSecretFromJSON('testcase2.json'); // Second JSON file
    console.log("The constant (c) for testcase2.json is:", secretResult2);
} catch (error) {
    console.error("Error:", error.message);
}