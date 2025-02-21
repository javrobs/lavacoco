import capitalize from "../src/utils/capitalize";

test('capitalize "javi robles" to "Javi robles"', () => {
    expect(capitalize("javi robles")).toBe("Javi robles");
})


