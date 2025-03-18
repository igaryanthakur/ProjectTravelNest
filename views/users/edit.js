<% layout("/layouts/boilerplate") %>
<div class="row mt-3">
  <div class="col-8 offset-2">
    <h3>Edit your listing</h3>
    <form
      method="POST"
      action="/listings/<%= listing._id%>?_method=PUT"
      novalidate
      class="needs-validation"
      enctype="multipart/form-data"
    >
      <div class="mb-3">
        <label for="title" class="form-label">UserName</label>
        <input
          type="text"
          name="listing[title]"
          value="<%= currUser.username %>"
          class="form-control"
          id="title"
          required
        />
        <div class="valid-feedback">Title Looks good!</div>
      </div>
      <button class="btn btn-dark edit-btn mt-2">Edit</button>
      <br /><br />
    </form>
  </div>
</div>
