import { useState } from "react";

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const addBlog = (e) => {
        e.preventDefault();
        createBlog({ title, author, url });
    };

    return (
        <form onSubmit={addBlog}>
            <div>
                title
                <input
                    type="text"
                    name="title"
                    value={title}
                    placeholder="title here..."
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author
                <input
                    type="text"
                    name="author"
                    value={author}
                    placeholder="author here..."
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    name="url"
                    value={url}
                    placeholder="url here..."
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">save</button>
        </form>
    );
};

export default BlogForm;