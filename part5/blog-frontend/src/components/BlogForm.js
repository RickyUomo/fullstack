const BlogForm = ({
    addBlog,
    title,
    author,
    url,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange
}) => (
    <form onSubmit={addBlog}>
        <div>
            title
            <input
                type="text"
                name="title"
                value={title}
                onChange={handleTitleChange}
            />
        </div>
        <div>
            author
            <input
                type="text"
                name="author"
                value={author}
                onChange={handleAuthorChange}
            />
        </div>
        <div>
            url
            <input
                type="text"
                name="url"
                value={url}
                onChange={handleUrlChange}
            />
        </div>
        <button type="submit">save</button>
    </form>
);

export default BlogForm;