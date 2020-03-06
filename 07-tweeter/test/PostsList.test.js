import PostsList from "../src/components/PostsList";

function createTestProps(props) {
  let posts = [
    {
      userId: "1",
      text: "text",
      created: Date.now()
    },
    {
      userId: "1",
      text: "text",
      created: Date.now()
    },
    {
      userId: "1",
      text: "text",
      created: Date.now()
    }
  ];
  return {
    posts,
    getUserById(id) {
      return { name: "User" + id };
    },
    ...props
  };
}

let wrapper;
let props;

beforeEach(() => {
  props = createTestProps();
  wrapper = shallow(
    <PostsList posts={props.posts} getUserById={props.getUserById} />
  );
});

describe("<PostsList /> rendering", () => {
  it("should render one <ul>", () => {
    expect(wrapper.find("ul")).toHaveLength(1);
  });

  it("should render an <li> for each post", () => {
    expect(wrapper.find("li")).toHaveLength(props.posts.length);
  });

  it("should render a formatted <li> with post data", () => {
    let post = props.posts[0];
    expect(
      wrapper
        .find("li")
        .first()
        .text()
    ).toEqual(
      `${props.getUserById(1).name}: ${post.text} (${new Date(
        post.created
      ).toString()})`
    );
  });
});
