import * as chai from "chai";
import * as sinonChai from "sinon-chai";

import { stubObject, stubInterface } from "./index";

chai.use(sinonChai);
const expect = chai.expect;

describe('ts-sinon', () => {
    describe('stubObject', () => {
        it('returns stub object with all methods stubbed when no methods or method map given', () => {
            const object = new class {
                test() {
                    return 123;
                }

                run() {
                    return 'run';
                }
            }

            const objectStub = stubObject(object);

            expect(object.test()).to.be.undefined;
            expect(object.run()).to.be.undefined;

            expect(object.run).to.have.been.called;
            expect(object.test).to.have.been.called;
        });

        it('returns partial stub object with only "test" method stubbed when array with "test" has been given', () => {
            const object = new class {
                test() {
                    return 123;
                }

                run() {
                    return 'run';
                }
            }

            const objectStub = stubObject(object, ['test']);

            expect(object.test()).to.be.undefined;
            expect(object.run()).to.equal('run');

            expect(object.test).to.have.been.called;
        });

        it('returns partial stub object with "run" method stubbed and returning "1" value when key value map { run: 1 } has been given', () => {
            const object = new class {
                test() {
                    return 123;
                }

                run() {
                    return 'run';
                }
            }
            
            const objectStub = stubObject(object, { 'run': 1 });

            expect(object.run()).to.equal(1);
            expect(object.test()).to.equal(123);

            expect(object.run).to.have.been.called;
        });

        describe('stubInterface', () => {
            interface ITest {
                method1(): void;
                method2(num: number): string;
            }

            it('returns stub object created from interface with all methods stubbed when no method map given', () => {
                const expectedMethod2Arg = 2;
                const interfaceStub: ITest = stubInterface<ITest>(); 
                interfaceStub.method2.returns('string');

                const object = new class {
                    test: ITest;
                    constructor(test: ITest) {
                        this.test = test;
                        this.test.method1();
                    }
                    run(num: number): string {
                        return this.test.method2(num);
                    }
                }(interfaceStub);

                expect(object.run(expectedMethod2Arg)).to.equal('string');
                expect(interfaceStub.method1).to.have.been.called;
                expect(interfaceStub.method2).to.have.been.calledWith(expectedMethod2Arg);
            });

            it('returns stub object created from interface with all methods stubbed including "method2" predefined to return "x" when method map to value { method: x } has been given', () => {
                const interfaceStub: ITest = stubInterface<ITest>({
                    method2: 'test'
                });

                const object = new class {
                    test: ITest;
                    constructor(test: ITest) {
                        this.test = test;
                        this.test.method1();
                    }
                    run(num: number): string {
                        return this.test.method2(num);
                    }
                }(interfaceStub);

                expect(object.run(123)).to.equal('test');
            });
        });            
    });
});