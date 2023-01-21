#include <folly/FileUtil.h>

using namespace::std;
using namespace::folly;

namespace offstore {
  class NativeStateCache {

  public:
    explicit NativeStateCache(string temporaryDirectory) {
      temporaryFile = temporaryDirectory + "__OFFSTORE_STORAGE";
    }
    virtual ~NativeStateCache() {}

  protected:
    string temporaryFile;
    
  public:
    string read() {
      string contents;
      readFile(temporaryFile.c_str(), contents);
      return contents;
    }
    
    void write(string contents) {
      writeFile(StringPiece(contents), temporaryFile.c_str());
    }
  };
}
