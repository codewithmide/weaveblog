import { useState, useEffect } from "react";
import lf from "localforage";
import { isNil } from "ramda";
import SDK from "weavedb-sdk";
import { ethers } from "ethers";
import ReactMarkdown from "react-markdown";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const contractTxId = "ZlGG4680rvF27zshSaxkhOe4zKOs6J6fv73PD814S0g";

export default function App() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [db, setDb] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formButtonText, setFormButtonText] = useState("Post Blog");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");

  const setupWeaveDB = async () => {
    const _db = new SDK({
      contractTxId,
    });
    await _db.init();
    setDb(_db);
    setIsDbReady(true);
  };

  const getBlogs = async () => {
    setBlogs(await db.cget("blogs", ["date", "desc"]));
  };

  const viewBlogDetails = (blog) => {
    setSelectedBlog(blog);
    onOpen();
  };

  const handleEditBlog = () => {
    setNewBlogTitle(selectedBlog.data.title);
    setNewBlogContent(selectedBlog.data.content);
    setIsEditing(true);
    setFormButtonText("Update Blog");
    onClose();
  };

  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const wallet_address = await provider.getSigner().getAddress();
    let identity = await lf.getItem(
      `temp_address:${contractTxId}:${wallet_address}`
    );
    let tx;
    let err;
    if (isNil(identity)) {
      ({ tx, identity, err } = await db.createTempAddress(wallet_address));
      const linked = await db.getAddressLink(identity.address);
      if (isNil(linked)) {
        alert("something went wrong");
        return;
      }
    } else {
      await lf.setItem("temp_address:current", wallet_address);
      setUser({
        wallet: wallet_address,
        privateKey: identity.privateKey,
      });
      return;
    }
    if (!isNil(tx) && isNil(tx.err)) {
      identity.tx = tx;
      identity.linked_address = wallet_address;
      await lf.setItem("temp_address:current", wallet_address);
      await lf.setItem(
        `temp_address:${contractTxId}:${wallet_address}`,
        JSON.parse(JSON.stringify(identity))
      );
      setUser({
        wallet: wallet_address,
        privateKey: identity.privateKey,
      });
    }
  };

  const logout = async () => {
    if (confirm("Would you like to sign out?")) {
      await lf.removeItem("temp_address:current");
      setUser(null, "temp_current");
    }
  };

  const NavBar = () => (
    <Flex
      p={3}
      position="fixed"
      w="100%"
      sx={{ top: 0, left: 0, alignItems: "center", padding: "30px" }}
    >
      <Flex align="center" mr={5}>
        <Text fontSize="xl" fontWeight="bold" color="black">
          WeaveBlog
        </Text>
      </Flex>

      <Box flex={1} />

      <Flex
        bg="#111"
        color="white"
        py={2}
        px={6}
        sx={{
          borderRadius: "5px",
          cursor: "pointer",
          ":hover": { opacity: 0.75 },
        }}
      >
        {!isNil(user) ? (
          <Box onClick={() => logout()}>{user.wallet.slice(0, 7)}</Box>
        ) : (
          <Box onClick={() => login()}>Connect Wallet</Box>
        )}
      </Flex>
    </Flex>
  );

  const CreateBlogForm = () => {
    const [localTitle, setLocalTitle] = useState(newBlogTitle);
    const [localContent, setLocalContent] = useState(newBlogContent);

    console.log(localContent);

    useEffect(() => {
      if (isEditing) {
        setLocalTitle(newBlogTitle);
        setLocalContent(newBlogContent);
      } else {
        setLocalTitle("");
        setLocalContent("");
      }
    }, [isEditing, newBlogTitle, newBlogContent]);

    const handleEditorChange = ({ text }) => {
      setLocalContent(text);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!localTitle || !localContent) {
        alert("Title and content are required.");
        return;
      }

      if (isEditing) {
        await db.update(
          { title: localTitle, content: localContent, modifiedDate: db.ts() },
          "blogs",
          selectedBlog.id,
          user
        );
        setIsEditing(false);
        setFormButtonText("Post Blog");
      } else {
        await db.add(
          {
            title: localTitle,
            content: localContent,
            author: user.wallet,
            date: db.ts(),
            modifiedDate: db.ts(),
          },
          "blogs",
          user
        );
      }

      setNewBlogTitle("");
      setNewBlogContent("");
      getBlogs();
    };

    return (
      <form onSubmit={handleSubmit}>
        <h2 style={{ fontWeight: "bold", margin: "10px 0" }}>
          Create a WeaveDB powered blog post
        </h2>
        <Input
          placeholder="Blog Title"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          mb={3}
          height={12}
        />
        <MdEditor
          value={localContent}
          style={{ height: 400 }}
          onChange={handleEditorChange}
        />
        <button
          type="submit"
          style={{
            background: "black",
            color: "white",
            padding: "15px 25px",
            borderRadius: "6px",
            marginTop: "20px",
          }}
        >
          {formButtonText}
        </button>
      </form>
    );
  };

  const BlogList = () => {
    return (
      <Flex direction="column">
        {blogs.length < 1 ? (
          <h2 style={{ fontWeight: "bold", margin: "10px 0" }}> </h2>
        ) : (
          <h2 style={{ fontWeight: "bold", margin: "10px 0" }}>My blog(s)</h2>
        )}
        {blogs.map((v) => (
          <Flex
            key={v.id}
            sx={{ border: "1px solid #ddd", borderRadius: "5px" }}
            p={5}
            mb={1}
            onClick={() => viewBlogDetails(v)}
            cursor="pointer"
          >
            <Box px={5} flex={1}>
              <Box fontSize="lg" mb={4} fontWeight="bold">
                {v.data.title}
              </Box>
              <div
                dangerouslySetInnerHTML={{
                  __html: v.data.content.slice(0, 150),
                }}
              />
            </Box>
          </Flex>
        ))}
      </Flex>
    );
  };

  const BlogDetailsModal = () => {
    const deleteBlog = async (id) => {
      if (window.confirm("Are you sure you want to delete this blog post?")) {
        try {
          await db.delete("blogs", id, user);
          getBlogs();
          onClose();
        } catch (error) {
          console.error("Failed to delete the blog:", error);
        }
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent padding="10px 20px">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "16px 0",
              padding: "0 20px",
            }}
          >
            <h2
              style={{
                flex: "1",
                fontSize: "28px",
                width: "100%",
                fontWeight: "bold",
              }}
            >
              {selectedBlog?.data.title}
            </h2>
            <ModalCloseButton style={{ marginTop: "20px" }} />
          </div>
          <ModalBody>
            <Box fontSize="sm">
              <span style={{ fontWeight: "bold" }}>Author:</span>{" "}
              {selectedBlog?.data.author}
            </Box>
            <Box fontSize="sm">
              <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
              {new Date(
                parseInt(selectedBlog?.data.date) * 1000
              ).toLocaleString()}
            </Box>
            {selectedBlog?.data.modifiedDate && (
              <Box fontSize="sm">
                <span style={{ fontWeight: "bold" }}>Modified:</span>{" "}
                {new Date(
                  parseInt(selectedBlog?.data.modifiedDate) * 1000
                ).toLocaleString()}
              </Box>
            )}
            <Box marginTop="16px">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      <pre
                        style={{
                          background: "#f6f8fa",
                          padding: "15px",
                          borderRadius: "5px",
                          margin: "20px 0",
                        }}
                      >
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code
                        style={{ backgroundColor: "#f6f8fa", padding: "3px" }}
                      >
                        {children}
                      </code>
                    );
                  },
                  a({ node, ...props }) {
                    return <a style={{ color: "#1a0dab" }} {...props} />;
                  },
                  p({ node, ...props }) {
                    return (
                      <p
                        style={{ textAlign: "justify", margin: "20px 0" }}
                        {...props}
                      />
                    );
                  },
                  li({ node, ...props }) {
                    return (
                      <li
                        style={{ textAlign: "justify", margin: "0px 20px" }}
                        {...props}
                      />
                    );
                  },
                  h1: ({ node, ...props }) => (
                    <h1
                      style={{ fontWeight: "bold", fontSize: "2em", marginBottom: "-20px", marginTop: "20px" }}
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      style={{ fontWeight: "bold", fontSize: "1.75em", marginBottom: "-20px", marginTop: "20px" }}
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      style={{ fontWeight: "bold", fontSize: "1.5em", marginBottom: "-20px", marginTop: "20px" }}
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      style={{ fontWeight: "bold", fontSize: "1.25em", marginBottom: "-20px", marginTop: "20px" }}
                      {...props}
                    />
                  ),
                  h5: ({ node, ...props }) => (
                    <h5
                      style={{ fontWeight: "bold", fontSize: "1em", marginBottom: "-20px", marginTop: "20px" }}
                      {...props}
                    />
                  ),
                  h6: ({ node, ...props }) => (
                    <h6
                      style={{ fontWeight: "bold", fontSize: "0.75em", marginBottom: "-20px", marginTop: "20px" }}
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => {
                    return (
                      <blockquote
                        style={{
                          borderLeft: '4px solid #ddd',
                          paddingLeft: '20px',
                          color: '#666',
                          fontStyle: 'italic',
                          margin: '20px 0',
                        }}
                        {...props}
                      />
                    );
                  },
                }}
              >
                {selectedBlog?.data.content}
              </ReactMarkdown>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleEditBlog}>
              Edit
            </Button>
            <Button
              colorScheme="red"
              onClick={() => deleteBlog(selectedBlog.id)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  useEffect(() => {
    setupWeaveDB();
  }, []);

  useEffect(() => {
    if (isDbReady) {
      getBlogs();
    }
  }, [isDbReady]);

  return (
    <ChakraProvider>
      <NavBar />
      <Flex
        mt="60px"
        width="100%"
        justify="space-between"
        marginTop="70px"
        gap={10}
        p={30}
      >
        <Box w="50%">{!isNil(user) && <CreateBlogForm />}</Box>

        <Box w="50%">
          <BlogList />
        </Box>
      </Flex>

      {selectedBlog && <BlogDetailsModal />}
    </ChakraProvider>
  );
}
