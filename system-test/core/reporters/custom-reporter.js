class CustomListReporter {
    constructor() {
        this.passedTests = 0;
        this.failedTests = 0;
        this.totalTests = 0;
        this.startTime = 0;
    }

    onBegin(config, suite) {
        this.totalTests = suite.allTests().length;
        this.startTime = Date.now();
        console.log(`Running ${this.totalTests} tests using ${config.workers} workers\n`);
    }

    onTestEnd(test, result) {
        const status = result.status;
        const duration = result.duration;
        
        // Extract channel type and test title
        const channelMatch = test.titlePath().find(t => t.includes('Channel'));
        const testTitle = test.title;
        
        // Extract channel name (UI or API) from "[UI Channel]" or "[API Channel]"
        const channelType = channelMatch ? channelMatch.replace('[', '').replace(' Channel]', '') : null;
        
        // Extract test data parameters from test title (everything in square brackets)
        const dataMatch = testTitle.match(/^(.+?)(\s+\[.+\])?$/);
        const baseTestName = dataMatch ? dataMatch[1] : testTitle;
        const dataParams = dataMatch && dataMatch[2] ? dataMatch[2].trim().replace(/^\[/, '').replace(/\]$/, '') : '';
        
        // Build clean title: test name [channel: UI, data params]
        const cleanTitle = channelType 
            ? (dataParams 
                ? `${baseTestName} [channel: ${channelType}, ${dataParams}]`
                : `${baseTestName} [channel: ${channelType}]`)
            : testTitle;

        if (status === 'passed') {
            this.passedTests++;
            console.log(`  ✓ ${this.padNumber(this.passedTests + this.failedTests)} ${cleanTitle} (${duration}ms)`);
        } else if (status === 'failed') {
            this.failedTests++;
            console.log(`  ✗ ${this.padNumber(this.passedTests + this.failedTests)} ${cleanTitle} (${duration}ms)`);
            if (result.error) {
                console.log(`    ${result.error.message}`);
            }
        } else if (status === 'skipped') {
            console.log(`  - ${this.padNumber(this.passedTests + this.failedTests)} ${cleanTitle}`);
        }
    }

    onEnd() {
        const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
        
        console.log(`\nTotal tests: ${this.totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        if (this.failedTests > 0) {
            console.log(`Failed: ${this.failedTests}`);
        }
        console.log(`Total time: ${totalTime}s`);
    }

    padNumber(num) {
        return String(num).padStart(3, ' ');
    }
}

module.exports = CustomListReporter;
