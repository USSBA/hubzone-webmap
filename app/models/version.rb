# Provide version information for the system.
class Version
  attr_reader :release

  def initialize(git_description = git_describe)
    @git_description = git_description
    @release ||= description
  end

  def major
    release[:major].to_i
  end

  def minor
    release[:minor].to_i
  end

  def patch
    release[:patch].to_i
  end

  def pre_release
    release[:pre_release]
  end

  def commit
    release[:commit_sha]
  end

  def tag
    release[:tag]
  end

  def delta
    release[:delta].to_i
  end

  def released?
    delta.zero?
  end

  private

  def description
    desc = @git_description
    matches = /^(.*)-(\d+)-g([a-f0-9]+)$/.match desc
    tag = matches[1]
    delta = matches[2]
    commit_sha = matches[3]
    { tag:         tag,
      delta:       delta,
      commit_sha:  commit_sha }.merge tag_components(tag)
  end

  def git_describe
    `git describe --long`
  end

  def tag_components(tag)
    components = /v?(\d+).(\d+).(\d+)-?(.*)/.match tag
    components.present? ? parsed_version(components) : config_version
  end

  def parsed_version(components)
    { major:       components[1],
      minor:       components[2],
      patch:       components[3],
      pre_release: components[4] }
  end

  def config_version
    { major:       MAP_CONFIG[:hubzone_map_version][:major],
      minor:       MAP_CONFIG[:hubzone_map_version][:minor],
      patch:       MAP_CONFIG[:hubzone_map_version][:patch],
      pre_release: MAP_CONFIG[:hubzone_map_version][:pre_release] }
  end
end
