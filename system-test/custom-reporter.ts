class CustomListReporter {
    private passedTests = 0;
    private failedTests = 0;
    private totalTests = 0;

    onBegin(config: any, suite: any) {
        this.totalTests = suite.allTests().length;
        console.log(`Running ${this.totalTests} tests using ${config.workers} workers\n`);
    }

    onTestEnd(test: any, result: any) {
        const status = result.status;
        const duration = result.duration;
        
        // Extract just the test title parts we want to show
        const channelMatch = test.titlePath().find(t => t.includes('Channel'));
        const testTitle = test.title;
        
        // Build clean title: [Channel] › test name
        const cleanTitle = channelMatch 
            ? `${channelMatch} › ${testTitle}`
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
        console.log(`\n  ${this.passedTests} passed`);
        if (this.failedTests > 0) {
            console.log(`  ${this.failedTests} failed`);
        }
    }

    private padNumber(num: number): string {
        return String(num).padStart(3, ' ');
    }
}

export default CustomListReporter;
