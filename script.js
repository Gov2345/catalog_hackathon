// Function to decode the Y values from various bases
function decodeValue(base, value) {
    return parseInt(value, base); // Converts the value from the given base to decimal
}

// Function to process both JSON test cases and output the results
function processJSON() {
    const jsonInput1 = document.getElementById('jsonInput1').value;
    const jsonInput2 = document.getElementById('jsonInput2').value;

    let output = '';

    // Process test case 1
    output += 'Test Case 1:\n';
    const result1 = processSingleJSON(jsonInput1);
    output += `Secret (Constant term 'c'): ${result1.secret}\n\nPoints: ${JSON.stringify(result1.points, null, 2)}\n\n`;

    // Process test case 2
    output += 'Test Case 2:\n';
    const result2 = processSingleJSON(jsonInput2);
    output += `Secret (Constant term 'c'): ${result2.secret}\n\nPoints: ${JSON.stringify(result2.points, null, 2)}\n`;

    if (result2.wrongPoints.length > 0) {
        output += `\nWrong Points Detected: ${JSON.stringify(result2.wrongPoints, null, 2)}\n`;
    } else {
        output += `\nNo Wrong Points Detected.\n`;
    }

    // Output the result to the page
    document.getElementById('output').textContent = output;
}

// Function to process a single test case JSON
function processSingleJSON(jsonInput) {
    try {
        const data = JSON.parse(jsonInput); // Parse the input JSON
        const n = data.keys.n; // Number of provided roots
        const k = data.keys.k; // Minimum number of points to solve

        let points = [];

        // Decode all the points
        for (let i = 1; i <= n; i++) {
            if (data[i]) {
                let x = parseInt(i); // x is the key of the object (index in the JSON)
                let base = parseInt(data[i].base); // base of the encoded value
                let value = data[i].value; // encoded value
                let y = decodeValue(base, value); // decoded y value
                points.push({ x, y });
            }
        }

        // Compute the secret using Lagrange interpolation
        let secret = lagrangeInterpolation(points, k);

        // Find wrong points (only relevant for the second test case)
        let wrongPoints = findWrongPoints(points, secret);

        return { secret, points, wrongPoints };

    } catch (e) {
        return { secret: 'Invalid JSON input', points: [], wrongPoints: [] };
    }
}

// Function to perform Lagrange interpolation to find the constant term (c)
function lagrangeInterpolation(points, k) {
    let c = 0; // This will hold the constant term after interpolation

    // Implement Lagrange interpolation for the constant term
    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        let li = 1; // Lagrange basis polynomial
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                li *= (0 - xj) / (xi - xj); // Calculate the Lagrange basis polynomial li(0)
            }
        }
        c += yi * li; // Add the contribution of yi * li(0) to the constant term
    }

    return Math.round(c); // Return the constant term (rounded)
}

// Function to find wrong points (Imposter points)
function findWrongPoints(points, correctC) {
    let wrongPoints = [];
    
    points.forEach(point => {
        let reconstructedY = reconstructYFromConstant(point.x, correctC);
        if (reconstructedY !== point.y) {
            wrongPoints.push(point);
        }
    });

    return wrongPoints;
}

// Example of a simple reconstruction from constant term (polynomial check)
// This function can be expanded for higher-degree polynomials
function reconstructYFromConstant(x, c) {
    return c; // In this case, the constant 'c' is the only term, but this function can be modified
}
