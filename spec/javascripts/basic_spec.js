describe ('This is how jasmine works', function() {
  it("can do basic math", function() {
    expect(1 + 1).toEqual(2);
  });

  it ("also knows when math is wrong", function() {
    expect(1 + 1).not.toEqual(3);
  });
});
